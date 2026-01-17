import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { Coach } from '../entity/coach.entity';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import { CreateCoachDto } from '../dto/create-coach.dto';
import { UpdateCoachDto } from '../dto/update-coach.dto';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Coach[]> {
    return this.coachesRepository.find({
      relations: ['user', 'categories'],
    });
  }

  async findOne(id: number): Promise<Coach> {
    const coach = await this.coachesRepository.findOne({
      where: { id },
      relations: ['user', 'categories'],
    });
    if (!coach) {
      throw new NotFoundException(`Coach with ID ${id} not found`);
    }
    return coach;
  }

  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    // Verificar que el username no exista
    const existingUser = await this.usersRepository.findOne({
      where: { username: createCoachDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Username ${createCoachDto.username} is already taken`,
      );
    }

    // Verificar que las categorías existan si se proporcionan
    let categories: Category[] = [];
    if (createCoachDto.categoryIds && createCoachDto.categoryIds.length > 0) {
      categories = await this.categoriesRepository.find({
        where: { id: In(createCoachDto.categoryIds) },
      });
      if (categories.length !== createCoachDto.categoryIds.length) {
        const foundIds = categories.map((cat) => cat.id);
        const notFoundIds = createCoachDto.categoryIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new NotFoundException(
          `Categories with IDs ${notFoundIds.join(', ')} not found`,
        );
      }
    }

    // Usar transacción para crear usuario y coach
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear usuario con rol de coach
      const user = queryRunner.manager.create(User, {
        username: createCoachDto.username,
        password: createCoachDto.password,
        role: 'coach',
      });
      const savedUser = await queryRunner.manager.save(User, user);

      // Crear perfil del coach
      const coach = queryRunner.manager.create(Coach, {
        userId: savedUser.id,
        firstName: createCoachDto.firstName,
        lastName: createCoachDto.lastName,
        document: createCoachDto.document,
        documentType: createCoachDto.documentType,
      });

      const savedCoach = await queryRunner.manager.save(Coach, coach);

      // Asociar categorías si se proporcionaron
      if (categories.length > 0) {
        savedCoach.categories = categories;
        await queryRunner.manager.save(Coach, savedCoach);
      }

      await queryRunner.commitTransaction();

      // Retornar el coach con sus relaciones
      return this.findOne(savedCoach.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateCoachDto: UpdateCoachDto): Promise<Coach> {
    const coach = await this.findOne(id);

    // Actualizar password del usuario si se proporciona
    if (updateCoachDto.password) {
      const user = await this.usersRepository.findOne({
        where: { id: coach.userId },
      });
      if (user) {
        user.password = updateCoachDto.password;
        await this.usersRepository.save(user);
      }
    }

    // Actualizar campos del coach
    if (updateCoachDto.firstName !== undefined) {
      coach.firstName = updateCoachDto.firstName;
    }
    if (updateCoachDto.lastName !== undefined) {
      coach.lastName = updateCoachDto.lastName;
    }
    if (updateCoachDto.document !== undefined) {
      coach.document = updateCoachDto.document;
    }
    if (updateCoachDto.documentType !== undefined) {
      coach.documentType = updateCoachDto.documentType;
    }

    // Actualizar categorías si se proporcionan
    if (updateCoachDto.categoryIds !== undefined) {
      if (updateCoachDto.categoryIds.length === 0) {
        // Si el array está vacío, eliminar todas las categorías
        coach.categories = [];
      } else {
        // Verificar que todas las categorías existan
        const categories = await this.categoriesRepository.find({
          where: { id: In(updateCoachDto.categoryIds) },
        });
        if (categories.length !== updateCoachDto.categoryIds.length) {
          const foundIds = categories.map((cat) => cat.id);
          const notFoundIds = updateCoachDto.categoryIds.filter(
            (id) => !foundIds.includes(id),
          );
          throw new NotFoundException(
            `Categories with IDs ${notFoundIds.join(', ')} not found`,
          );
        }
        coach.categories = categories;
      }
    }

    await this.coachesRepository.save(coach);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const coach = await this.findOne(id);
    // Al eliminar el coach, el usuario también se eliminará por CASCADE
    await this.coachesRepository.remove(coach);
  }
}
