import { Controller, Post, Get, UseGuards, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { User, UserRole } from 'src/users/entity/user.entity';
import { Payload } from '../models/payload.model';
import { UsersService } from 'src/users/service/users.service';
import { ProfilesService } from 'src/profiles/service/profiles.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterCompleteDto } from '../dto/register-complete.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private profilesService: ProfilesService,
  ) {}

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req) {
    const user = req.user as User;
    return {
      user,
      access_token: this.authService.generateToken(user),
    };
  }

  @ApiOperation({ summary: 'Registro público de jugador (solo usuario)' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El username ya esta en uso' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.create({
      username: registerDto.username,
      password: registerDto.password,
      role: UserRole.PLAYER,
      isActive: false,
    });
  }

  @ApiOperation({
    summary: 'Registro público completo de jugador (usuario + perfil)',
    description:
      'Crea un usuario con rol PLAYER (inactivo) y su perfil asociado en una sola petición. No requiere autenticación.',
  })
  @ApiBody({ type: RegisterCompleteDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario y perfil creados exitosamente',
  })
  @ApiResponse({ status: 409, description: 'El username o documento ya está en uso' })
  @Post('register-complete')
  async registerComplete(@Body() registerCompleteDto: RegisterCompleteDto) {
    // Crear usuario primero
    const user = await this.usersService.create({
      username: registerCompleteDto.username,
      password: registerCompleteDto.password,
      role: UserRole.PLAYER,
      isActive: false,
    });

    // Crear perfil asociado
    const profile = await this.profilesService.create({
      userId: user.id,
      nombre: registerCompleteDto.nombre,
      apellido: registerCompleteDto.apellido,
      tipoDocumento: registerCompleteDto.tipoDocumento,
      numeroDocumento: registerCompleteDto.numeroDocumento,
    });

    // Retornar usuario con perfil
    return {
      ...user,
      profile,
    };
  }

  @ApiOperation({ summary: 'Verificar token JWT' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  verify() {
    return {
      valid: true,
      message: 'Token is valid',
    };
  }

  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {
    const payload = req.user as Payload;
    const user = await this.usersService.findOne(payload.sub);

    // Excluir el password de la respuesta
    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      isMaster: user.role === UserRole.MASTER,
      isAdmin: user.role === UserRole.ADMIN,
    };
  }
}
