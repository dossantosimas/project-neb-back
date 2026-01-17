import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entity/user.entity';
import { Profile } from '../profiles/entity/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), PassportModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
