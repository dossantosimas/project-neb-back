import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Verificar que el usuario exista
    const user = await this.usersRepository.findOne({
      where: { id: createProfileDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createProfileDto.userId} not found`,
      );
    }

    // Verificar que el usuario no tenga ya un perfil
    const existingProfile = await this.profilesRepository.findOne({
      where: { userId: createProfileDto.userId },
    });
    if (existingProfile) {
      throw new ConflictException(
        `El usuario ${createProfileDto.userId} ya tiene un perfil`,
      );
    }

    // Verificar que la categoría exista si se proporciona
    let category: Category | null = null;
    if (createProfileDto.categoriaId) {
      category = await this.categoriesRepository.findOne({
        where: { id: createProfileDto.categoriaId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createProfileDto.categoriaId} not found`,
        );
      }
    }

    const profile = this.profilesRepository.create({
      userId: createProfileDto.userId,
      nombre: createProfileDto.nombre,
      apellido: createProfileDto.apellido,
      tipoDocumento: createProfileDto.tipoDocumento,
      numeroDocumento: createProfileDto.numeroDocumento,
      categoriaId: createProfileDto.categoriaId || null,
      familiar: createProfileDto.familiar || null,
      contactoFamiliar: createProfileDto.contactoFamiliar || null,
      parentezco: createProfileDto.parentezco || null,
      correo: createProfileDto.correo || null,
    });

    return this.profilesRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository.find({
      relations: ['user', 'category'],
    });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    return this.profilesRepository.findOne({
      where: { userId },
      relations: ['user', 'category'],
    });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);

    // Verificar que la categoría exista si se proporciona
    if (updateProfileDto.categoriaId !== undefined) {
      if (updateProfileDto.categoriaId === null) {
        profile.categoriaId = null;
        profile.category = null;
      } else {
        const category = await this.categoriesRepository.findOne({
          where: { id: updateProfileDto.categoriaId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateProfileDto.categoriaId} not found`,
          );
        }
        profile.categoriaId = updateProfileDto.categoriaId;
      }
    }

    // Actualizar campos si se proporcionan
    if (updateProfileDto.nombre !== undefined) {
      profile.nombre = updateProfileDto.nombre;
    }
    if (updateProfileDto.apellido !== undefined) {
      profile.apellido = updateProfileDto.apellido;
    }
    if (updateProfileDto.tipoDocumento !== undefined) {
      profile.tipoDocumento = updateProfileDto.tipoDocumento;
    }
    if (updateProfileDto.numeroDocumento !== undefined) {
      profile.numeroDocumento = updateProfileDto.numeroDocumento;
    }
    if (updateProfileDto.familiar !== undefined) {
      profile.familiar = updateProfileDto.familiar;
    }
    if (updateProfileDto.contactoFamiliar !== undefined) {
      profile.contactoFamiliar = updateProfileDto.contactoFamiliar;
    }
    if (updateProfileDto.parentezco !== undefined) {
      profile.parentezco = updateProfileDto.parentezco;
    }
    if (updateProfileDto.correo !== undefined) {
      profile.correo = updateProfileDto.correo;
    }

    return this.profilesRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await this.profilesRepository.remove(profile);
  }
}
