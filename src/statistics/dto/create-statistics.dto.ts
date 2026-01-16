import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatisticsDto {
  @ApiProperty({
    description: 'ID del jugador',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  playerId: number;

  @ApiProperty({
    description: 'ID del partido',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  matchId: string;

  @ApiProperty({
    description: 'Minutos jugados',
    example: 25,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  minutesPlayed: number;

  @ApiProperty({
    description: 'Puntos totales',
    example: 15,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  points: number;

  @ApiProperty({
    description: 'Tiros de campo anotados',
    example: 6,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  fgMade: number;

  @ApiProperty({
    description: 'Tiros de campo intentados',
    example: 12,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  fgAttempted: number;

  @ApiProperty({
    description: 'Triples anotados',
    example: 2,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  threeMade: number;

  @ApiProperty({
    description: 'Triples intentados',
    example: 5,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  threeAttempted: number;

  @ApiProperty({
    description: 'Tiros libres anotados',
    example: 1,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  ftMade: number;

  @ApiProperty({
    description: 'Tiros libres intentados',
    example: 2,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  ftAttempted: number;

  @ApiProperty({
    description: 'Rebotes ofensivos',
    example: 3,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  reboundsOffensive: number;

  @ApiProperty({
    description: 'Rebotes defensivos',
    example: 5,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  reboundsDefensive: number;

  @ApiProperty({
    description: 'Asistencias',
    example: 4,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assists: number;

  @ApiProperty({
    description: 'Robos',
    example: 2,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  steals: number;

  @ApiProperty({
    description: 'Bloqueos',
    example: 1,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  blocks: number;

  @ApiProperty({
    description: 'Pérdidas',
    example: 3,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  turnovers: number;

  @ApiProperty({
    description: 'Faltas personales',
    example: 2,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  fouls: number;

  @ApiProperty({
    description: 'Impacto en cancha (+/-)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  plusMinus?: number;

  @ApiProperty({
    description: 'Indica si fue titular',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  starter?: boolean;

  @ApiProperty({
    description: 'Posición jugada (PG / SG / SF / PF / C)',
    example: 'PG',
    required: false,
  })
  @IsOptional()
  @IsString()
  positionPlayed?: string;

  @ApiProperty({
    description: 'Observaciones',
    example: 'Excelente rendimiento en el segundo cuarto',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
