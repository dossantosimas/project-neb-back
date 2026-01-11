import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { User } from 'src/users/entity/user.entity';
import { Payload } from '../models/payload.model';
import { UsersService } from 'src/users/service/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req) {
    const user = req.user as User;
    return {
      user,
      access_token: this.authService.generateToken(user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  verify() {
    // Si llegamos aquí, el token es válido
    return {
      valid: true,
      message: 'Token is valid',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {
    const payload = req.user as Payload;
    const user = await this.usersService.findOne(payload.sub);
    return user;
  }
}
