import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './controller/payments.controller';
import { PaymentsService } from './service/payments.service';
import { Payment } from './entity/payment.entity';
import { PlayerProfile } from '../profiles/entity/player-profile.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PlayerProfile]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
