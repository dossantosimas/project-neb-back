import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({
    description: 'Nombre de usuario único para crear el User',
    example: 'jugador1',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Nombre del jugador',
    example: 'Juan',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Apellido del jugador',
    example: 'Pérez',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del jugador',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de documento',
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
    description: 'Fecha de nacimiento (formato: YYYY-MM-DD)',
    example: '2010-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Contacto familiar (email o teléfono)',
    example: 'madre@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  familyContact?: string;

  @ApiProperty({
    description: 'Parentesco con el contacto familiar',
    example: 'Madre',
    required: false,
  })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    description: 'ID del coach asignado',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  coachId?: number;

  @ApiProperty({
    description: 'Estado activo del jugador',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
