import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from './entity/statistics.entity';
import { PlayerProfile } from '../profiles/entity/player-profile.entity';
import { Match } from '../matches/entity/match.entity';
import { StatisticsService } from './service/statistics.service';
import { StatisticsController } from './controller/statistics.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistics, PlayerProfile, Match]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
