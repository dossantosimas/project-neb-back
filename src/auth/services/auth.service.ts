import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/service/users.service';
import { User } from 'src/users/entity/user.entity';
// import { User } from 'src/users/entities/user.entity';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  generateToken(user: User) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
