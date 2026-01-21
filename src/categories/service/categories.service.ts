import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { UserRole } from '../../users/entity/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  private toCategoryWithCoaches(category: Category) {
    const coaches = (category.profiles ?? [])
      .filter((profile) => profile?.user && profile.user.role === UserRole.COACH)
      .map((profile) => ({
        profileId: profile.id,
        userId: profile.userId,
        username: profile.user.username,
        nombre: profile.nombre,
        apellido: profile.apellido,
        tipoDocumento: profile.tipoDocumento,
        numeroDocumento: profile.numeroDocumento,
      }));

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      coaches,
    };
  }

  private toPlayersFromCategory(category: Category) {
    return (category.profiles ?? [])
      .filter(
        (profile) => profile?.user && profile.user.role === UserRole.PLAYER,
      )
      .map((profile) => ({
        profileId: profile.id,
        userId: profile.userId,
        username: profile.user.username,
        nombre: profile.nombre,
        apellido: profile.apellido,
        tipoDocumento: profile.tipoDocumento,
        numeroDocumento: profile.numeroDocumento,
      }));
  }

  private async findOneEntity(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['profiles', 'profiles.user'],
    });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException(
        `La categoría con el nombre "${createCategoryDto.name}" ya existe`,
      );
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<
    Array<{
      id: number;
      name: string;
      description: string | null;
      coaches: Array<{
        profileId: number;
        userId: number;
        username: string;
        nombre: string;
        apellido: string;
        tipoDocumento: string;
        numeroDocumento: string;
      }>;
    }>
  > {
    const categories = await this.categoriesRepository.find({
      relations: ['profiles', 'profiles.user'],
      order: { id: 'ASC' },
    });
    return categories.map((category) => this.toCategoryWithCoaches(category));
  }

  async findOne(
    id: number,
  ): Promise<{
    id: number;
    name: string;
    description: string | null;
    coaches: Array<{
      profileId: number;
      userId: number;
      username: string;
      nombre: string;
      apellido: string;
      tipoDocumento: string;
      numeroDocumento: string;
    }>;
  }> {
    const category = await this.findOneEntity(id);
    return this.toCategoryWithCoaches(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneEntity(id);

    // Verificar si el nuevo nombre ya existe en otra categoría
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `La categoría con el nombre "${updateCategoryDto.name}" ya existe`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOneEntity(id);
    await this.categoriesRepository.remove(category);
  }

  async findPlayersByCategoryId(
    id: number,
  ): Promise<
    Array<{
      profileId: number;
      userId: number;
      username: string;
      nombre: string;
      apellido: string;
      tipoDocumento: string;
      numeroDocumento: string;
    }>
  > {
    const category = await this.findOneEntity(id);
    return this.toPlayersFromCategory(category);
  }
}
