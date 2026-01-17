import { IsNotEmpty, IsEnum, IsInt, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileType } from '../entity/profile.entity';

export class CreateProfileDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Tipo de perfil',
    enum: ProfileType,
    example: ProfileType.PLAYER,
  })
  @IsNotEmpty()
  @IsEnum(ProfileType)
  profileType: ProfileType;

  @ApiProperty({
    description: 'ID de la categoría',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number | null;

  @ApiProperty({
    description: 'ID del perfil del coach (solo para players)',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  coachProfileId?: number | null;

  // Campos opcionales para crear CoachProfile automáticamente (admin/master)
  @ApiProperty({
    description: 'Nombre para CoachProfile (solo para admin/master)',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Apellido para CoachProfile (solo para admin/master)',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Tipo de documento para CoachProfile (solo para admin/master)',
    required: false,
  })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({
    description: 'Documento para CoachProfile (solo para admin/master)',
    required: false,
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    description: 'IDs de categorías para CoachProfile (solo para admin/master)',
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
