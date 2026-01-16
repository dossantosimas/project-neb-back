import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TournamentType {
  LEAGUE = 'league',
  CUP = 'cup',
  FRIENDLY = 'friendly',
}

export enum TournamentStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
}

export class CreateTournamentDto {
  @ApiProperty({
    description: 'Nombre del torneo',
    example: 'Liga Nacional 2025',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Temporada (ej: 2025, 2025-2026)',
    example: '2025',
  })
  @IsNotEmpty()
  @IsString()
  season: string;

  @ApiProperty({
    description: 'Categoría (U12, U15, U18, Senior)',
    example: 'U18',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Fecha de inicio (formato: YYYY-MM-DD)',
    example: '2025-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Fecha de fin (formato: YYYY-MM-DD)',
    example: '2025-06-30',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Ciudad / sede del torneo',
    example: 'Buenos Aires',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Tipo de torneo',
    enum: TournamentType,
    example: TournamentType.LEAGUE,
  })
  @IsNotEmpty()
  @IsEnum(TournamentType)
  type: TournamentType;

  @ApiProperty({
    description: 'Estado del torneo',
    enum: TournamentStatus,
    example: TournamentStatus.SCHEDULED,
  })
  @IsNotEmpty()
  @IsEnum(TournamentStatus)
  status: TournamentStatus;
}
