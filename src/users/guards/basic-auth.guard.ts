import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly username = '1140856875';
  private readonly password = '0mn1c0ns4';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, credentials] = authorization.split(' ');

    if (scheme !== 'Basic' || !credentials) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    if (username === this.username && password === this.password) {
      return true;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
