import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './service/profiles.service';
import { ProfilesController } from './controller/profiles.controller';
import { Profile } from './entity/profile.entity';
import { User } from '../users/entity/user.entity';
import { Category } from '../categories/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User, Category])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
