import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

    // Verificar que las categorías existan si se proporcionan
    let categories: Category[] = [];
    if (createProfileDto.categoryIds?.length) {
      categories = await this.categoriesRepository.findBy({
        id: In(createProfileDto.categoryIds),
      });

      const foundIds = new Set(categories.map((c) => c.id));
      const missing = createProfileDto.categoryIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        throw new NotFoundException(
          `Categories not found: ${missing.join(', ')}`,
        );
      }
    }

    const profile = this.profilesRepository.create({
      userId: createProfileDto.userId,
      nombre: createProfileDto.nombre,
      apellido: createProfileDto.apellido,
      tipoDocumento: createProfileDto.tipoDocumento,
      numeroDocumento: createProfileDto.numeroDocumento,
      familiar: createProfileDto.familiar || null,
      contactoFamiliar: createProfileDto.contactoFamiliar || null,
      parentezco: createProfileDto.parentezco || null,
      correo: createProfileDto.correo || null,
      categories,
    });

    return this.profilesRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository.find({
      relations: ['user', 'categories'],
    });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user', 'categories'],
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    return this.profilesRepository.findOne({
      where: { userId },
      relations: ['user', 'categories'],
    });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);

    // Actualizar categorías (many-to-many) si se proporciona:
    // - Enviar [] para limpiar todas las categorías
    if (updateProfileDto.categoryIds !== undefined) {
      const ids = updateProfileDto.categoryIds ?? [];
      if (!ids.length) {
        profile.categories = [];
      } else {
        const categories = await this.categoriesRepository.findBy({ id: In(ids) });
        const foundIds = new Set(categories.map((c) => c.id));
        const missing = ids.filter((cid) => !foundIds.has(cid));
        if (missing.length) {
          throw new NotFoundException(
            `Categories not found: ${missing.join(', ')}`,
          );
        }
        profile.categories = categories;
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
