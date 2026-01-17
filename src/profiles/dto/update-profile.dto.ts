import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileType } from '../entity/profile.entity';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Tipo de perfil',
    enum: ProfileType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProfileType)
  profileType?: ProfileType;

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
}
