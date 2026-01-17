import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Profile } from './entity/profile.entity';
import { PlayerProfile } from './entity/player-profile.entity';
import { CoachProfile } from './entity/coach-profile.entity';
import { User } from '../users/entity/user.entity';
import { Category } from '../categories/entity/category.entity';
import { ProfilesController } from './controller/profiles.controller';
import { ProfilesService } from './service/profiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      PlayerProfile,
      CoachProfile,
      User,
      Category,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
