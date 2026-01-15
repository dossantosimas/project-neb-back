import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesController } from './controller/coaches.controller';
import { CoachesService } from './service/coaches.service';
import { Coach } from './entity/coach.entity';
import { User } from '../users/entity/user.entity';
import { Category } from '../categories/entity/category.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach, User, Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService],
})
export class CoachesModule {}
