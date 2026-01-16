import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entity/match.entity';
import { Tournament } from '../tournaments/entity/tournament.entity';
import { MatchesService } from './service/matches.service';
import { MatchesController } from './controller/matches.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Tournament]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
