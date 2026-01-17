import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
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
import { LoginDto } from '../dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from 'src/players/entity/player.entity';
import { Coach } from 'src/coaches/entity/coach.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
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

    // Verificar si es jugador
    const player = await this.playersRepository.findOne({
      where: { userId: user.id },
    });

    // Verificar si es entrenador
    const coach = await this.coachesRepository.findOne({
      where: { userId: user.id },
    });

    return {
      ...user,
      isPlayer: !!player,
      isCoach: !!coach,
      playerId: player?.id || null,
      coachId: coach?.id || null,
      isMaster: user.role === UserRole.MASTER,
      isAdmin: user.role === UserRole.ADMIN,
    };
  }
}
