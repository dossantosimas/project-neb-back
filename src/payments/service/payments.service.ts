import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../entity/payment.entity';
import { Player } from '../../players/entity/player.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({
      relations: ['player'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['player'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByPlayer(playerId: number): Promise<Payment[]> {
    // Verificar que el jugador exista
    const player = await this.playersRepository.findOne({
      where: { id: playerId },
    });
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    return this.paymentsRepository.find({
      where: { playerId },
      relations: ['player'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Verificar que el jugador exista
    const player = await this.playersRepository.findOne({
      where: { id: createPaymentDto.playerId },
    });
    if (!player) {
      throw new NotFoundException(
        `Player with ID ${createPaymentDto.playerId} not found`,
      );
    }

    const payment = new Payment();
    payment.playerId = createPaymentDto.playerId;
    payment.amount = createPaymentDto.amount;
    payment.debt = createPaymentDto.debt ?? 0;
    payment.description = createPaymentDto.description || null;
    payment.status = createPaymentDto.status || PaymentStatus.PENDING;
    payment.paymentMethod = createPaymentDto.paymentMethod || null;
    payment.paymentDate = createPaymentDto.paymentDate
      ? new Date(createPaymentDto.paymentDate)
      : null;

    return this.paymentsRepository.save(payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    // Verificar que el jugador exista si se actualiza
    if (updatePaymentDto.playerId !== undefined) {
      const player = await this.playersRepository.findOne({
        where: { id: updatePaymentDto.playerId },
      });
      if (!player) {
        throw new NotFoundException(
          `Player with ID ${updatePaymentDto.playerId} not found`,
        );
      }
      payment.playerId = updatePaymentDto.playerId;
    }

    if (updatePaymentDto.amount !== undefined) {
      payment.amount = updatePaymentDto.amount;
    }
    if (updatePaymentDto.debt !== undefined) {
      payment.debt = updatePaymentDto.debt;
    }
    if (updatePaymentDto.description !== undefined) {
      payment.description = updatePaymentDto.description || null;
    }
    if (updatePaymentDto.status !== undefined) {
      payment.status = updatePaymentDto.status;
    }
    if (updatePaymentDto.paymentMethod !== undefined) {
      payment.paymentMethod = updatePaymentDto.paymentMethod || null;
    }
    if (updatePaymentDto.paymentDate !== undefined) {
      payment.paymentDate = updatePaymentDto.paymentDate
        ? new Date(updatePaymentDto.paymentDate)
        : null;
    }

    return this.paymentsRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
  }
}
