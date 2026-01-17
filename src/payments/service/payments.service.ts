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

  async findByMonth(month: number, year?: number): Promise<Payment[]> {
    // Si no se proporciona año, usar el año actual
    const currentYear = year || new Date().getFullYear();

    return this.findByMonthAndYear(month, currentYear);
  }

  async findByYear(year: number): Promise<Payment[]> {
    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Crear fecha de inicio del año (1 de enero) como string YYYY-MM-DD
    const startDateStr = `${year}-01-01`;
    
    // Crear fecha de fin del año (31 de diciembre) como string YYYY-MM-DD
    const endDateStr = `${year}-12-31`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .where('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findByMonthAndYear(month: number, year: number): Promise<Payment[]> {
    // Validar mes (1-12)
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Crear fecha de inicio del mes (primer día del mes) como string YYYY-MM-DD
    const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    
    // Crear fecha de fin del mes (último día del mes) como string YYYY-MM-DD
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .where('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findByMonthAndPlayer(
    month: number,
    playerId: number,
    year?: number,
  ): Promise<Payment[]> {
    // Si no se proporciona año, usar el año actual
    const currentYear = year || new Date().getFullYear();

    return this.findByMonthAndYearAndPlayer(month, currentYear, playerId);
  }

  async findByYearAndPlayer(year: number, playerId: number): Promise<Payment[]> {
    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Verificar que el jugador exista
    const player = await this.playersRepository.findOne({
      where: { id: playerId },
    });
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    // Crear fecha de inicio del año (1 de enero) como string YYYY-MM-DD
    const startDateStr = `${year}-01-01`;
    
    // Crear fecha de fin del año (31 de diciembre) como string YYYY-MM-DD
    const endDateStr = `${year}-12-31`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .where('payment.playerId = :playerId', { playerId })
      .andWhere('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findByMonthAndYearAndPlayer(
    month: number,
    year: number,
    playerId: number,
  ): Promise<Payment[]> {
    // Validar mes (1-12)
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Verificar que el jugador exista
    const player = await this.playersRepository.findOne({
      where: { id: playerId },
    });
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    // Crear fecha de inicio del mes (primer día del mes) como string YYYY-MM-DD
    const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    
    // Crear fecha de fin del mes (último día del mes) como string YYYY-MM-DD
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .where('payment.playerId = :playerId', { playerId })
      .andWhere('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Verificar que el jugador exista por documento
    const player = await this.playersRepository.findOne({
      where: { document: createPaymentDto.document },
    });
    if (!player) {
      throw new NotFoundException(
        `Player with document ${createPaymentDto.document} not found`,
      );
    }

    const payment = new Payment();
    payment.playerId = player.id;
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
