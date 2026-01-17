import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { PlayerProfile } from '../entity/player-profile.entity';
import { CoachProfile } from '../entity/coach-profile.entity';
import { Category } from '../../categories/entity/category.entity';
import { User } from '../../users/entity/user.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { CreatePlayerProfileDto } from '../dto/create-player-profile.dto';
import { CreateCoachProfileDto } from '../dto/create-coach-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePlayerProfileDto } from '../dto/update-player-profile.dto';
import { UpdateCoachProfileDto } from '../dto/update-coach-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(PlayerProfile)
    private playerProfilesRepository: Repository<PlayerProfile>,
    @InjectRepository(CoachProfile)
    private coachProfilesRepository: Repository<CoachProfile>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    console.log('🔍 ProfilesService.createProfile - DTO recibido:', {
      userId: createProfileDto.userId,
      profileType: createProfileDto.profileType,
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      documentType: createProfileDto.documentType,
      document: createProfileDto.document,
      categoryIds: createProfileDto.categoryIds,
    });
    
    // Verificar que el usuario exista
    const user = await this.usersRepository.findOne({
      where: { id: createProfileDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createProfileDto.userId} not found`,
      );
    }

    // Verificar que el usuario no tenga ya un perfil del mismo tipo
    const existingProfile = await this.profilesRepository.findOne({
      where: {
        userId: createProfileDto.userId,
        profileType: createProfileDto.profileType,
      },
    });
    if (existingProfile) {
      throw new ConflictException(
        `El usuario ya tiene un perfil de tipo ${createProfileDto.profileType}`,
      );
    }

    // Verificar que la categoría exista si se proporciona
    if (createProfileDto.categoryId !== null && createProfileDto.categoryId !== undefined) {
      const category = await this.categoriesRepository.findOne({
        where: { id: createProfileDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createProfileDto.categoryId} not found`,
        );
      }
    }

    // Verificar que el coachProfile exista si se proporciona
    if (
      createProfileDto.coachProfileId !== null &&
      createProfileDto.coachProfileId !== undefined
    ) {
      const coachProfile = await this.coachProfilesRepository.findOne({
        where: { id: createProfileDto.coachProfileId },
      });
      if (!coachProfile) {
        throw new NotFoundException(
          `CoachProfile with ID ${createProfileDto.coachProfileId} not found`,
        );
      }
    }

    const profile = this.profilesRepository.create({
      userId: createProfileDto.userId,
      profileType: createProfileDto.profileType,
      categoryId: createProfileDto.categoryId ?? null,
      coachProfileId: createProfileDto.coachProfileId ?? null,
    });

    const savedProfile = await this.profilesRepository.save(profile);

    // Si el perfil es de tipo admin, o si el usuario tiene role MASTER (1) o ADMIN (2),
    // crear automáticamente un CoachProfile
    if (
      savedProfile.profileType === 'admin' ||
      user.role === 1 || // MASTER
      user.role === 2 // ADMIN
    ) {
      // Verificar que no exista ya un CoachProfile para este perfil
      const existingCoachProfile =
        await this.coachProfilesRepository.findOne({
          where: { profileId: savedProfile.id },
        });

      if (!existingCoachProfile) {
        // Obtener categorías si se proporcionaron
        let categories: Category[] = [];
        if (
          createProfileDto.categoryIds !== undefined &&
          createProfileDto.categoryIds !== null &&
          Array.isArray(createProfileDto.categoryIds) &&
          createProfileDto.categoryIds.length > 0
        ) {
          categories = await this.categoriesRepository.find({
            where: { id: In(createProfileDto.categoryIds) },
          });
        }

        // Crear CoachProfile con los datos proporcionados o valores por defecto
        const coachProfile = this.coachProfilesRepository.create({
          profileId: savedProfile.id,
          firstName:
            createProfileDto.firstName !== undefined && createProfileDto.firstName !== null && createProfileDto.firstName !== ''
              ? createProfileDto.firstName
              : user.username, // Usar firstName del DTO o username como fallback
          lastName:
            createProfileDto.lastName !== undefined && createProfileDto.lastName !== null
              ? createProfileDto.lastName
              : '', // Usar lastName del DTO o string vacío
          documentType:
            createProfileDto.documentType !== undefined && createProfileDto.documentType !== null && createProfileDto.documentType !== ''
              ? createProfileDto.documentType
              : 'N/A', // Usar documentType del DTO o 'N/A'
          document:
            createProfileDto.document !== undefined && createProfileDto.document !== null && createProfileDto.document !== ''
              ? createProfileDto.document
              : null, // Usar document del DTO o null
          categories: categories,
        });

        await this.coachProfilesRepository.save(coachProfile);
      }
    }

    return savedProfile;
  }

  async createPlayerProfile(
    createPlayerProfileDto: CreatePlayerProfileDto,
  ): Promise<PlayerProfile> {
    // Verificar que el perfil exista
    const profile = await this.profilesRepository.findOne({
      where: { id: createPlayerProfileDto.profileId },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile with ID ${createPlayerProfileDto.profileId} not found`,
      );
    }

    // Verificar que el perfil sea de tipo player
    if (profile.profileType !== 'player') {
      throw new BadRequestException(
        'El perfil debe ser de tipo player para crear un PlayerProfile',
      );
    }

    // Verificar que no exista ya un PlayerProfile para este perfil
    const existingPlayerProfile =
      await this.playerProfilesRepository.findOne({
        where: { profileId: createPlayerProfileDto.profileId },
      });
    if (existingPlayerProfile) {
      throw new ConflictException(
        `Ya existe un PlayerProfile para el perfil ${createPlayerProfileDto.profileId}`,
      );
    }

    const playerProfile = this.playerProfilesRepository.create({
      profileId: createPlayerProfileDto.profileId,
      firstName: createPlayerProfileDto.firstName,
      lastName: createPlayerProfileDto.lastName,
      email: createPlayerProfileDto.email,
      document: createPlayerProfileDto.document,
      documentType: createPlayerProfileDto.documentType,
      birthDate: createPlayerProfileDto.birthDate
        ? new Date(createPlayerProfileDto.birthDate)
        : null,
      familyName: createPlayerProfileDto.familyName ?? null,
      familyContact: createPlayerProfileDto.familyContact ?? null,
      relationship: createPlayerProfileDto.relationship ?? null,
      isActive: createPlayerProfileDto.isActive ?? false,
    });

    return this.playerProfilesRepository.save(playerProfile);
  }

  async createCoachProfile(
    createCoachProfileDto: CreateCoachProfileDto,
  ): Promise<CoachProfile> {
    // Verificar que el perfil exista
    const profile = await this.profilesRepository.findOne({
      where: { id: createCoachProfileDto.profileId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile with ID ${createCoachProfileDto.profileId} not found`,
      );
    }

    // Verificar que el perfil sea de tipo coach o admin, o que el usuario tenga rol MASTER o ADMIN
    const isCoachProfile = profile.profileType === 'coach';
    const isAdminProfile = profile.profileType === 'admin';
    const isMasterOrAdmin = profile.user && (profile.user.role === 1 || profile.user.role === 2); // MASTER = 1, ADMIN = 2

    if (!isCoachProfile && !isAdminProfile && !isMasterOrAdmin) {
      throw new BadRequestException(
        'El perfil debe ser de tipo coach o admin, o el usuario debe tener rol MASTER o ADMIN para crear un CoachProfile',
      );
    }

    // Verificar que no exista ya un CoachProfile para este perfil
    const existingCoachProfile =
      await this.coachProfilesRepository.findOne({
        where: { profileId: createCoachProfileDto.profileId },
      });
    if (existingCoachProfile) {
      throw new ConflictException(
        `Ya existe un CoachProfile para el perfil ${createCoachProfileDto.profileId}`,
      );
    }

    // Verificar que las categorías existan si se proporcionan
    let categories: Category[] = [];
    if (
      createCoachProfileDto.categoryIds !== undefined &&
      createCoachProfileDto.categoryIds !== null &&
      Array.isArray(createCoachProfileDto.categoryIds) &&
      createCoachProfileDto.categoryIds.length > 0
    ) {
      categories = await this.categoriesRepository.find({
        where: { id: In(createCoachProfileDto.categoryIds) },
      });
      if (categories.length !== createCoachProfileDto.categoryIds.length) {
        const foundIds = categories.map((cat) => cat.id);
        const missingIds = createCoachProfileDto.categoryIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new NotFoundException(
          `Categories with IDs ${missingIds.join(', ')} not found`,
        );
      }
    }

    const coachProfile = this.coachProfilesRepository.create({
      profileId: createCoachProfileDto.profileId,
      firstName: createCoachProfileDto.firstName,
      lastName: createCoachProfileDto.lastName,
      documentType: createCoachProfileDto.documentType,
      document: createCoachProfileDto.document || null,
      categories: categories,
    });

    return this.coachProfilesRepository.save(coachProfile);
  }

  async findCoachProfile(id: number): Promise<CoachProfile> {
    const coachProfile = await this.coachProfilesRepository.findOne({
      where: { id },
      relations: [
        'profile',
        'profile.user',
        'profile.category',
        'categories',
      ],
    });
    if (!coachProfile) {
      throw new NotFoundException(`CoachProfile with ID ${id} not found`);
    }
    return coachProfile;
  }

  async updateCoachProfile(
    id: number,
    updateCoachProfileDto: UpdateCoachProfileDto,
  ): Promise<CoachProfile> {
    const coachProfile = await this.findCoachProfile(id);

    if (updateCoachProfileDto.firstName !== undefined) {
      coachProfile.firstName = updateCoachProfileDto.firstName;
    }

    if (updateCoachProfileDto.lastName !== undefined) {
      coachProfile.lastName = updateCoachProfileDto.lastName;
    }

    if (updateCoachProfileDto.documentType !== undefined) {
      coachProfile.documentType = updateCoachProfileDto.documentType;
    }

    if (updateCoachProfileDto.document !== undefined) {
      coachProfile.document = updateCoachProfileDto.document;
    }

    // Actualizar categorías si se proporcionan
    if (updateCoachProfileDto.categoryIds !== undefined) {
      if (
        updateCoachProfileDto.categoryIds === null ||
        !Array.isArray(updateCoachProfileDto.categoryIds) ||
        updateCoachProfileDto.categoryIds.length === 0
      ) {
        coachProfile.categories = [];
      } else {
        const categories = await this.categoriesRepository.find({
          where: { id: In(updateCoachProfileDto.categoryIds) },
        });
        if (categories.length !== updateCoachProfileDto.categoryIds.length) {
          const foundIds = categories.map((cat) => cat.id);
          const missingIds = updateCoachProfileDto.categoryIds.filter(
            (id) => !foundIds.includes(id),
          );
          throw new NotFoundException(
            `Categories with IDs ${missingIds.join(', ')} not found`,
          );
        }
        coachProfile.categories = categories;
      }
    }

    return this.coachProfilesRepository.save(coachProfile);
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'coachProfile'],
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findPlayerProfile(id: number): Promise<PlayerProfile> {
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { id },
      relations: ['profile', 'profile.user', 'profile.category'],
    });
    if (!playerProfile) {
      throw new NotFoundException(`PlayerProfile with ID ${id} not found`);
    }
    return playerProfile;
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(id);

    if (updateProfileDto.profileType !== undefined) {
      profile.profileType = updateProfileDto.profileType;
    }

    if (updateProfileDto.categoryId !== undefined) {
      if (updateProfileDto.categoryId === null) {
        profile.categoryId = null;
      } else {
        const category = await this.categoriesRepository.findOne({
          where: { id: updateProfileDto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateProfileDto.categoryId} not found`,
          );
        }
        profile.categoryId = updateProfileDto.categoryId;
      }
    }

    if (updateProfileDto.coachProfileId !== undefined) {
      if (updateProfileDto.coachProfileId === null) {
        profile.coachProfileId = null;
      } else {
        const coachProfile = await this.coachProfilesRepository.findOne({
          where: { id: updateProfileDto.coachProfileId },
        });
        if (!coachProfile) {
          throw new NotFoundException(
            `CoachProfile with ID ${updateProfileDto.coachProfileId} not found`,
          );
        }
        profile.coachProfileId = updateProfileDto.coachProfileId;
      }
    }

    return this.profilesRepository.save(profile);
  }

  async updatePlayerProfile(
    id: number,
    updatePlayerProfileDto: UpdatePlayerProfileDto,
  ): Promise<PlayerProfile> {
    const playerProfile = await this.findPlayerProfile(id);

    if (updatePlayerProfileDto.firstName !== undefined) {
      playerProfile.firstName = updatePlayerProfileDto.firstName;
    }

    if (updatePlayerProfileDto.lastName !== undefined) {
      playerProfile.lastName = updatePlayerProfileDto.lastName;
    }

    if (updatePlayerProfileDto.email !== undefined) {
      playerProfile.email = updatePlayerProfileDto.email;
    }

    if (updatePlayerProfileDto.document !== undefined) {
      playerProfile.document = updatePlayerProfileDto.document;
    }

    if (updatePlayerProfileDto.documentType !== undefined) {
      playerProfile.documentType = updatePlayerProfileDto.documentType;
    }

    if (updatePlayerProfileDto.birthDate !== undefined) {
      playerProfile.birthDate = updatePlayerProfileDto.birthDate
        ? new Date(updatePlayerProfileDto.birthDate)
        : null;
    }

    if (updatePlayerProfileDto.familyName !== undefined) {
      playerProfile.familyName = updatePlayerProfileDto.familyName ?? null;
    }

    if (updatePlayerProfileDto.familyContact !== undefined) {
      playerProfile.familyContact =
        updatePlayerProfileDto.familyContact ?? null;
    }

    if (updatePlayerProfileDto.relationship !== undefined) {
      playerProfile.relationship = updatePlayerProfileDto.relationship ?? null;
    }

    if (updatePlayerProfileDto.isActive !== undefined) {
      playerProfile.isActive = updatePlayerProfileDto.isActive;
    }

    return this.playerProfilesRepository.save(playerProfile);
  }
}
