import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

export class CreateMatchDto {
  @ApiProperty({
    description: 'Fecha del partido (formato: YYYY-MM-DD)',
    example: '2025-02-15',
  })
  @IsNotEmpty()
  @IsDateString()
  matchDate: string;

  @ApiProperty({
    description: 'Hora del partido (formato: HH:mm)',
    example: '18:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  matchTime?: string;

  @ApiProperty({
    description: 'Indica si es un partido amistoso',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFriendly?: boolean;

  @ApiProperty({
    description: 'ID del torneo (si aplica)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tournamentId?: string;

  @ApiProperty({
    description: 'ID del equipo local',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  homeTeamId: string;

  @ApiProperty({
    description: 'ID del equipo visitante',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  awayTeamId: string;

  @ApiProperty({
    description: 'Cancha / ciudad donde se juega',
    example: 'Estadio Central',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Estado del partido',
    enum: MatchStatus,
    example: MatchStatus.SCHEDULED,
    default: MatchStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}
