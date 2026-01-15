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

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
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

    // Si se intenta crear un usuario master, verificar que no exista otro
    if (createUserDto.role === UserRole.MASTER) {
      const existingMaster = await this.usersRepository.findOne({
        where: { role: UserRole.MASTER },
      });
      if (existingMaster) {
        throw new ConflictException(
          'Ya existe un usuario con rol master. Solo puede haber un usuario master en la base de datos.',
        );
      }
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
      // Si se intenta asignar rol master, verificar que no exista otro
      if (updateUserDto.role === UserRole.MASTER && user.role !== UserRole.MASTER) {
        const existingMaster = await this.usersRepository.findOne({
          where: { role: UserRole.MASTER },
        });
        if (existingMaster && existingMaster.id !== id) {
          throw new ConflictException(
            'Ya existe un usuario con rol master. Solo puede haber un usuario master en la base de datos.',
          );
        }
      }
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
