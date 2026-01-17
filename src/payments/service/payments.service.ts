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
import { PlayerProfile } from '../../profiles/entity/player-profile.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(PlayerProfile)
    private playerProfilesRepository: Repository<PlayerProfile>,
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

  async findByPlayer(playerProfileId: number): Promise<Payment[]> {
    // Verificar que el jugador exista
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { id: playerProfileId },
    });
    if (!playerProfile) {
      throw new NotFoundException(`PlayerProfile with ID ${playerProfileId} not found`);
    }

    return this.paymentsRepository.find({
      where: { playerProfileId },
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
    playerProfileId: number,
    year?: number,
  ): Promise<Payment[]> {
    // Si no se proporciona año, usar el año actual
    const currentYear = year || new Date().getFullYear();

    return this.findByMonthAndYearAndPlayer(month, currentYear, playerProfileId);
  }

  async findByYearAndPlayer(year: number, playerProfileId: number): Promise<Payment[]> {
    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Verificar que el jugador exista
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { id: playerProfileId },
    });
    if (!playerProfile) {
      throw new NotFoundException(`PlayerProfile with ID ${playerProfileId} not found`);
    }

    // Crear fecha de inicio del año (1 de enero) como string YYYY-MM-DD
    const startDateStr = `${year}-01-01`;
    
    // Crear fecha de fin del año (31 de diciembre) como string YYYY-MM-DD
    const endDateStr = `${year}-12-31`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .where('payment.playerProfileId = :playerProfileId', { playerProfileId })
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
    playerProfileId: number,
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
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { id: playerProfileId },
    });
    if (!playerProfile) {
      throw new NotFoundException(`PlayerProfile with ID ${playerProfileId} not found`);
    }

    // Crear fecha de inicio del mes (primer día del mes) como string YYYY-MM-DD
    const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    
    // Crear fecha de fin del mes (último día del mes) como string YYYY-MM-DD
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .where('payment.playerProfileId = :playerProfileId', { playerProfileId })
      .andWhere('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Verificar que el jugador exista por documento
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { document: createPaymentDto.document },
    });
    if (!playerProfile) {
      throw new NotFoundException(
        `PlayerProfile with document ${createPaymentDto.document} not found`,
      );
    }

    const payment = new Payment();
    payment.playerProfileId = playerProfile.id;
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
    if (updatePaymentDto.playerProfileId !== undefined) {
      const playerProfile = await this.playerProfilesRepository.findOne({
        where: { id: updatePaymentDto.playerProfileId },
      });
      if (!playerProfile) {
        throw new NotFoundException(
          `PlayerProfile with ID ${updatePaymentDto.playerProfileId} not found`,
        );
      }
      payment.playerProfileId = updatePaymentDto.playerProfileId;
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
