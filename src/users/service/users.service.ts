import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{
    data: User[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.category', 'category')
      .orderBy('user.id', 'ASC');

    // Si hay búsqueda, filtrar por username
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.where('user.username ILIKE :search', { search: searchTerm });
    }

    // Aplicar paginación (valores por defecto: page=1, limit=10)
    const pageNum = page ?? 1;
    const limitNum = limit ?? 10;
    const skip = (pageNum - 1) * limitNum;

    queryBuilder.skip(skip).take(limitNum);

    // Obtener datos y total
    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limitNum);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'profile.category'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el username ya existe
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `El username ${createUserDto.username} ya está en uso`,
      );
    }

    const user = this.usersRepository.create({
      username: createUserDto.username,
      password: createUserDto.password,
      role: createUserDto.role || UserRole.USER,
      isActive: createUserDto.isActive ?? false,
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Verificar si el username ya existe en otro usuario
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `El username ${updateUserDto.username} ya está en uso`,
        );
      }
      user.username = updateUserDto.username;
    }

    // Actualizar password si se proporciona
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    // Actualizar rol si se proporciona
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }

    // Actualizar isActive si se proporciona
    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
