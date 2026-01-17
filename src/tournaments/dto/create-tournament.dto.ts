import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({
    description: 'Nombre del torneo',
    example: 'Liga Nacional 2025',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'País donde se realiza el torneo',
    example: 'Argentina',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Ciudad donde se realiza el torneo',
    example: 'Buenos Aires',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Fecha del torneo (formato: YYYY-MM-DD)',
    example: '2025-01-15',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    description: 'Descripción del torneo',
    example: 'Torneo de la temporada 2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
