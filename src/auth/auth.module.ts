import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.model';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '6d' },
      }),
    }),
    // JwtModule.register({
    //   secret: 'my-secret-key',
    //   signOptions: { expiresIn: '1h' },
    // }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
