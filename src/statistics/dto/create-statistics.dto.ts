import {
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatisticsDto {
  @ApiProperty({
    description: 'ID del perfil del jugador',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  playerProfileId: number;

  @ApiProperty({
    description: 'ID del partido',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  matchId: number;

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
    description: 'Rebotes',
    example: 8,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  rebounds: number;

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
}
