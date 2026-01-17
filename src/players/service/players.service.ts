import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Player } from '../entity/player.entity';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import { Coach } from '../../coaches/entity/coach.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find({
      relations: ['user', 'category', 'coach'],
    });
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.playersRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'coach'],
    });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // Verificar que el username no exista
    const existingUser = await this.usersRepository.findOne({
      where: { username: createPlayerDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Username ${createPlayerDto.username} is already taken`,
      );
    }

    // Verificar que la categoría exista si se proporciona
    let categoryId: number | undefined;
    if (createPlayerDto.categoryId !== undefined) {
      const category = await this.categoriesRepository.findOne({
        where: { id: createPlayerDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createPlayerDto.categoryId} not found`,
        );
      }
      categoryId = createPlayerDto.categoryId;
    }

    // Verificar que el coach exista si se proporciona
    let coachId: number | undefined;
    if (createPlayerDto.coachId !== undefined) {
      const coach = await this.coachesRepository.findOne({
        where: { id: createPlayerDto.coachId },
      });
      if (!coach) {
        throw new NotFoundException(
          `Coach with ID ${createPlayerDto.coachId} not found`,
        );
      }
      coachId = createPlayerDto.coachId;
    }

    // Usar transacción para crear usuario y jugador
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear usuario con rol de player
      const user = new User();
      user.username = createPlayerDto.username;
      user.password = createPlayerDto.password;
      user.role = 'player';
      const savedUser = await queryRunner.manager.save(User, user);

      // Crear perfil del jugador
      const player = new Player();
      player.userId = savedUser.id;
      player.categoryId = categoryId ?? null;
      player.coachId = coachId ?? null;
      player.firstName = createPlayerDto.firstName;
      player.lastName = createPlayerDto.lastName;
      player.email = createPlayerDto.email;
      player.document = createPlayerDto.document;
      player.documentType = createPlayerDto.documentType;
      player.birthDate = createPlayerDto.birthDate
        ? new Date(createPlayerDto.birthDate)
        : null;
      player.familyName = createPlayerDto.familyName || null;
      player.familyContact = createPlayerDto.familyContact || null;
      player.relationship = createPlayerDto.relationship || null;
      player.isActive = createPlayerDto.isActive ?? false;

      const savedPlayer = await queryRunner.manager.save(Player, player);

      await queryRunner.commitTransaction();

      // Retornar el jugador con sus relaciones
      return this.findOne(savedPlayer.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);

    // Actualizar password del usuario si se proporciona
    if (updatePlayerDto.password) {
      const user = await this.usersRepository.findOne({
        where: { id: player.userId },
      });
      if (user) {
        user.password = updatePlayerDto.password;
        await this.usersRepository.save(user);
      }
    }

    // Verificar y actualizar categoría si se proporciona
    if (updatePlayerDto.categoryId !== undefined) {
      if (updatePlayerDto.categoryId === null) {
        // Permitir establecer a null
        player.categoryId = null;
      } else {
        const category = await this.categoriesRepository.findOne({
          where: { id: updatePlayerDto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updatePlayerDto.categoryId} not found`,
          );
        }
        player.categoryId = updatePlayerDto.categoryId;
      }
    }

    // Verificar y actualizar coach si se proporciona
    if (updatePlayerDto.coachId !== undefined) {
      if (updatePlayerDto.coachId === null) {
        // Permitir establecer a null
        player.coachId = null;
      } else {
        const coach = await this.coachesRepository.findOne({
          where: { id: updatePlayerDto.coachId },
        });
        if (!coach) {
          throw new NotFoundException(
            `Coach with ID ${updatePlayerDto.coachId} not found`,
          );
        }
        player.coachId = updatePlayerDto.coachId;
      }
    }

    // Actualizar otros campos
    if (updatePlayerDto.firstName !== undefined) {
      player.firstName = updatePlayerDto.firstName;
    }
    if (updatePlayerDto.lastName !== undefined) {
      player.lastName = updatePlayerDto.lastName;
    }
    if (updatePlayerDto.email !== undefined) {
      player.email = updatePlayerDto.email;
    }
    if (updatePlayerDto.document !== undefined) {
      player.document = updatePlayerDto.document;
    }
    if (updatePlayerDto.documentType !== undefined) {
      player.documentType = updatePlayerDto.documentType;
    }
    if (updatePlayerDto.birthDate !== undefined) {
      player.birthDate = updatePlayerDto.birthDate
        ? new Date(updatePlayerDto.birthDate)
        : null;
    }
    if (updatePlayerDto.familyName !== undefined) {
      player.familyName = updatePlayerDto.familyName ?? null;
    }
    if (updatePlayerDto.familyContact !== undefined) {
      player.familyContact = updatePlayerDto.familyContact ?? null;
    }
    if (updatePlayerDto.relationship !== undefined) {
      player.relationship = updatePlayerDto.relationship ?? null;
    }
    if (updatePlayerDto.isActive !== undefined) {
      player.isActive = updatePlayerDto.isActive;
    }

    await this.playersRepository.save(player);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const player = await this.findOne(id);
    // Al eliminar el jugador, el usuario también se eliminará por CASCADE
    await this.playersRepository.remove(player);
  }
}
