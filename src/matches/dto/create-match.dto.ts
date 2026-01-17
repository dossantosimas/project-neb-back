import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    description: 'ID del torneo (si aplica)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  tournamentId?: number;

  @ApiProperty({
    description: 'Equipo oponente',
    example: 'Lakers',
  })
  @IsNotEmpty()
  @IsString()
  opposingTeam: string;

  @ApiProperty({
    description: 'Puntos del equipo local',
    example: 95,
  })
  @IsNotEmpty()
  @IsNumber()
  homeScore: number;

  @ApiProperty({
    description: 'Puntos del equipo visitante',
    example: 88,
  })
  @IsNotEmpty()
  @IsNumber()
  awayScore: number;

  @ApiProperty({
    description: 'País donde se juega',
    example: 'Argentina',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Ciudad donde se juega',
    example: 'Buenos Aires',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Fecha del partido (formato: YYYY-MM-DD)',
    example: '2025-02-15',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Descripción del partido',
    example: 'Partido de la temporada regular',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
