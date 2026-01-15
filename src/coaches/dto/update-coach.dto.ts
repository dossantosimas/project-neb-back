import {
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoachDto {
  @ApiProperty({ description: 'Nueva contraseña', required: false, minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'Nombre del coach', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Apellido del coach', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Número de documento', required: false })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ description: 'Tipo de documento', required: false })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({
    description: 'IDs de las categorías (array vacío para eliminar todas)',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
