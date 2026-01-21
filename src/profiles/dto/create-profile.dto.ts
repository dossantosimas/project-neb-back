import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Nombre del perfil' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Apellido del perfil' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ description: 'Tipo de documento (CC, TI, CE, etc.)' })
  @IsString()
  @IsNotEmpty()
  tipoDocumento: string;

  @ApiProperty({ description: 'Número de documento' })
  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;

  @ApiPropertyOptional({
    description: 'IDs de categorías asociadas al perfil (many-to-many)',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  categoryIds?: number[];

  @ApiPropertyOptional({ description: 'Nombre del familiar' })
  @IsString()
  @IsOptional()
  familiar?: string | null;

  @ApiPropertyOptional({ description: 'Contacto del familiar' })
  @IsString()
  @IsOptional()
  contactoFamiliar?: string | null;

  @ApiPropertyOptional({ description: 'Parentezco con el familiar' })
  @IsString()
  @IsOptional()
  parentezco?: string | null;

  @ApiPropertyOptional({ description: 'Correo electrónico' })
  @IsEmail()
  @IsOptional()
  correo?: string | null;
}
