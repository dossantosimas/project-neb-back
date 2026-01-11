import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.model';
import { Payload } from '../models/payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService<Env>) {
    const secret = configService.get('JWT_SECRET', { infer: true });
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: Payload) {
    return payload;
  }
}
