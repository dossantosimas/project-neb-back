import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entity/tournament.entity';
import { TournamentsService } from './service/tournaments.service';
import { TournamentsController } from './controller/tournaments.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
