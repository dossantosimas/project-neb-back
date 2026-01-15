import {
  IsString,
  IsEmail,
  MinLength,
  IsDateString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerDto {
  @ApiProperty({ description: 'Nueva contraseña', required: false, minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'Nombre del jugador', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Apellido del jugador', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Correo electrónico', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Número de documento', required: false })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ description: 'Tipo de documento', required: false })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({ description: 'Fecha de nacimiento (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ description: 'Contacto familiar', required: false })
  @IsOptional()
  @IsString()
  familyContact?: string;

  @ApiProperty({ description: 'Parentesco', required: false })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({ description: 'ID de la categoría (null para desasociar)', required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number | null;

  @ApiProperty({ description: 'ID del coach (null para desasociar)', required: false })
  @IsOptional()
  @IsInt()
  coachId?: number | null;

  @ApiProperty({ description: 'Estado activo', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
