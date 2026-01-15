import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersController } from './controller/players.controller';
import { PlayersService } from './service/players.service';
import { Player } from './entity/player.entity';
import { User } from '../users/entity/user.entity';
import { Category } from '../categories/entity/category.entity';
import { Coach } from '../coaches/entity/coach.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, User, Category, Coach]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
