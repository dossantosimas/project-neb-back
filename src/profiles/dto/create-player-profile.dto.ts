import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerProfileDto {
  @ApiProperty({
    description: 'ID del perfil',
    example: 1,
  })
  @IsNotEmpty()
  profileId: number;

  @ApiProperty({
    description: 'Nombre',
    example: 'Juan',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Apellido',
    example: 'García',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email',
    example: 'juan.garcia@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Documento',
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI',
  })
  @IsNotEmpty()
  @IsString()
  documentType: string;

  @ApiProperty({
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
    example: '2000-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Nombre del familiar',
    example: 'María García',
    required: false,
  })
  @IsOptional()
  @IsString()
  familyName?: string | null;

  @ApiProperty({
    description: 'Contacto del familiar',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  familyContact?: string | null;

  @ApiProperty({
    description: 'Relación con el familiar',
    example: 'Madre',
    required: false,
  })
  @IsOptional()
  @IsString()
  relationship?: string | null;

  @ApiProperty({
    description: 'Estado activo',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
