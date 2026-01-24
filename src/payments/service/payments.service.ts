import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entity/payment.entity';
import { User } from '../../users/entity/user.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(filters?: {
    userId?: number;
    month?: number;
    year?: number;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    minDebt?: number;
    maxDebt?: number;
    hasDebt?: boolean;
    description?: string;
    page?: number;
    limit?: number;
  }): Promise<Payment[] | { data: Payment[]; meta: any }> {
    const queryBuilder = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile');

    // Filtro por userId
    if (filters?.userId) {
      queryBuilder.andWhere('payment.userId = :userId', {
        userId: filters.userId,
      });
    }

    // Filtro por mes y año
    if (filters?.month && filters?.year) {
      const startDateStr = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
      const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
      const endDateStr = `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      queryBuilder.andWhere('payment.paymentDate >= :monthStartDate', {
        monthStartDate: startDateStr,
      });
      queryBuilder.andWhere('payment.paymentDate <= :monthEndDate', {
        monthEndDate: endDateStr,
      });
    } else if (filters?.year && !filters?.month) {
      // Solo año
      const startDateStr = `${filters.year}-01-01`;
      const endDateStr = `${filters.year}-12-31`;
      queryBuilder.andWhere('payment.paymentDate >= :yearStartDate', {
        yearStartDate: startDateStr,
      });
      queryBuilder.andWhere('payment.paymentDate <= :yearEndDate', {
        yearEndDate: endDateStr,
      });
    } else if (filters?.month && !filters?.year) {
      // Solo mes (año actual)
      const currentYear = new Date().getFullYear();
      const startDateStr = `${currentYear}-${String(filters.month).padStart(2, '0')}-01`;
      const daysInMonth = new Date(currentYear, filters.month, 0).getDate();
      const endDateStr = `${currentYear}-${String(filters.month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      queryBuilder.andWhere('payment.paymentDate >= :monthOnlyStartDate', {
        monthOnlyStartDate: startDateStr,
      });
      queryBuilder.andWhere('payment.paymentDate <= :monthOnlyEndDate', {
        monthOnlyEndDate: endDateStr,
      });
    }

    // Filtro por rango de fechas (usa nombres únicos de parámetros)
    if (filters?.startDate) {
      queryBuilder.andWhere('payment.paymentDate >= :filterStartDate', {
        filterStartDate: filters.startDate,
      });
    }
    if (filters?.endDate) {
      queryBuilder.andWhere('payment.paymentDate <= :filterEndDate', {
        filterEndDate: filters.endDate,
      });
    }

    // Filtro por monto mínimo
    if (filters?.minAmount !== undefined) {
      queryBuilder.andWhere('payment.amount >= :minAmount', {
        minAmount: filters.minAmount,
      });
    }

    // Filtro por monto máximo
    if (filters?.maxAmount !== undefined) {
      queryBuilder.andWhere('payment.amount <= :maxAmount', {
        maxAmount: filters.maxAmount,
      });
    }

    // Filtro por deuda mínima
    if (filters?.minDebt !== undefined) {
      queryBuilder.andWhere('payment.debt >= :minDebt', {
        minDebt: filters.minDebt,
      });
    }

    // Filtro por deuda máxima
    if (filters?.maxDebt !== undefined) {
      queryBuilder.andWhere('payment.debt <= :maxDebt', {
        maxDebt: filters.maxDebt,
      });
    }

    // Filtro por si tiene deuda o no
    if (filters?.hasDebt !== undefined) {
      if (filters.hasDebt) {
        queryBuilder.andWhere('payment.debt > 0');
      } else {
        queryBuilder.andWhere('payment.debt = 0');
      }
    }

    // Filtro por descripción (búsqueda parcial)
    if (filters?.description) {
      queryBuilder.andWhere('payment.description ILIKE :description', {
        description: `%${filters.description}%`,
      });
    }

    // Ordenar por fecha de creación descendente (más reciente primero)
    // Usamos createdAt como orden principal ya que siempre tiene valor
    queryBuilder.orderBy('payment.createdAt', 'DESC');

    // Paginación - Si se proporciona page o limit, se activa la paginación
    const shouldPaginate = filters?.page !== undefined || filters?.limit !== undefined;
    
    if (shouldPaginate) {
      // Valores por defecto: page=1, limit=10
      const pageNum = filters?.page && filters.page > 0 ? filters.page : 1;
      const limitNum = filters?.limit && filters.limit > 0 ? filters.limit : 10;
      const skip = (pageNum - 1) * limitNum;

      queryBuilder.skip(skip).take(limitNum);

      const [data, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limitNum);

      // Transformar datos para incluir nombre y apellido
      const transformedData = data.map((payment) => ({
        ...payment,
        userName: payment.user?.profile?.nombre || null,
        userLastName: payment.user?.profile?.apellido || null,
      }));

      return {
        data: transformedData,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1,
        },
      };
    }

    // Sin paginación, devolver todos los resultados
    const allPayments = await queryBuilder.getMany();
    
    // Transformar datos para incluir nombre y apellido
    return allPayments.map((payment) => ({
      ...payment,
      userName: payment.user?.profile?.nombre || null,
      userLastName: payment.user?.profile?.apellido || null,
    }));
  }

  async findOne(id: number): Promise<any> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user', 'user.profile'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    // Transformar para incluir nombre y apellido
    return {
      ...payment,
      userName: payment.user?.profile?.nombre || null,
      userLastName: payment.user?.profile?.apellido || null,
    };
  }

  async findLatestPayment(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const payment = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('payment.userId = :userId', { userId })
      .andWhere('payment.paymentDate IS NOT NULL')
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getOne();

    if (!payment) {
      throw new NotFoundException(
        `No payment found for user with ID ${userId}`,
      );
    }

    // Transformar para incluir nombre y apellido
    return {
      ...payment,
      userName: payment.user?.profile?.nombre || null,
      userLastName: payment.user?.profile?.apellido || null,
    };
  }

  async findByUser(userId: number): Promise<Payment[]> {
    // Verificar que el usuario exista
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.paymentsRepository.find({
      where: { userId },
      relations: ['user'],
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
      .leftJoinAndSelect('payment.user', 'user')
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
      .leftJoinAndSelect('payment.user', 'user')
      .where('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findByMonthAndUser(
    month: number,
    userId: number,
    year?: number,
  ): Promise<Payment[]> {
    // Si no se proporciona año, usar el año actual
    const currentYear = year || new Date().getFullYear();

    return this.findByMonthAndYearAndUser(month, currentYear, userId);
  }

  async findByYearAndUser(year: number, userId: number): Promise<Payment[]> {
    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Verificar que el usuario exista
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Crear fecha de inicio del año (1 de enero) como string YYYY-MM-DD
    const startDateStr = `${year}-01-01`;
    
    // Crear fecha de fin del año (31 de diciembre) como string YYYY-MM-DD
    const endDateStr = `${year}-12-31`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .where('payment.userId = :userId', { userId })
      .andWhere('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async findByMonthAndYearAndUser(
    month: number,
    year: number,
    userId: number,
  ): Promise<Payment[]> {
    // Validar mes (1-12)
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    // Validar año (debe ser un número positivo)
    if (year < 1 || year > 9999) {
      throw new BadRequestException('Year must be between 1 and 9999');
    }

    // Verificar que el usuario exista
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Crear fecha de inicio del mes (primer día del mes) como string YYYY-MM-DD
    const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    
    // Crear fecha de fin del mes (último día del mes) como string YYYY-MM-DD
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .where('payment.userId = :userId', { userId })
      .andWhere('payment.paymentDate IS NOT NULL')
      .andWhere('payment.paymentDate >= :startDate', { startDate: startDateStr })
      .andWhere('payment.paymentDate <= :endDate', { endDate: endDateStr })
      .orderBy('payment.paymentDate', 'DESC')
      .addOrderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    // Verificar que el usuario exista
    const user = await this.usersRepository.findOne({
      where: { id: createPaymentDto.userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createPaymentDto.userId} not found`,
      );
    }

    const payment = new Payment();
    payment.userId = createPaymentDto.userId;
    payment.amount = createPaymentDto.amount;
    payment.debt = createPaymentDto.debt ?? 0;
    payment.description = createPaymentDto.description || null;
    payment.paymentDate = createPaymentDto.paymentDate
      ? new Date(createPaymentDto.paymentDate)
      : null;

    const savedPayment = await this.paymentsRepository.save(payment);
    
    // Cargar relaciones para devolver datos completos
    const paymentWithRelations = await this.paymentsRepository.findOne({
      where: { id: savedPayment.id },
      relations: ['user', 'user.profile'],
    });

    // Transformar para incluir nombre y apellido
    return {
      ...paymentWithRelations,
      userName: paymentWithRelations?.user?.profile?.nombre || null,
      userLastName: paymentWithRelations?.user?.profile?.apellido || null,
    };
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<any> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user', 'user.profile'],
    });
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Verificar que el usuario exista si se actualiza
    if (updatePaymentDto.userId !== undefined) {
      const user = await this.usersRepository.findOne({
        where: { id: updatePaymentDto.userId },
        relations: ['profile'],
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updatePaymentDto.userId} not found`,
        );
      }
      payment.userId = updatePaymentDto.userId;
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
    if (updatePaymentDto.paymentDate !== undefined) {
      payment.paymentDate = updatePaymentDto.paymentDate
        ? new Date(updatePaymentDto.paymentDate)
        : null;
    }

    const updatedPayment = await this.paymentsRepository.save(payment);
    
    // Cargar relaciones actualizadas
    const paymentWithRelations = await this.paymentsRepository.findOne({
      where: { id: updatedPayment.id },
      relations: ['user', 'user.profile'],
    });

    // Transformar para incluir nombre y apellido
    return {
      ...paymentWithRelations,
      userName: paymentWithRelations?.user?.profile?.nombre || null,
      userLastName: paymentWithRelations?.user?.profile?.apellido || null,
    };
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
  }
}
