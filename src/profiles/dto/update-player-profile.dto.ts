import {
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerProfileDto {
  @ApiProperty({
    description: 'Nombre',
    example: 'Juan',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Apellido',
    example: 'García',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email',
    example: 'juan.garcia@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Documento',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI',
    required: false,
  })
  @IsOptional()
  @IsString()
  documentType?: string;

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
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
