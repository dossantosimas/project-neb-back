import { IsNotEmpty, IsInt, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoachProfileDto {
  @ApiProperty({
    description: 'ID del perfil',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @ApiProperty({
    description: 'Nombre',
    example: 'Carlos',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Apellido',
    example: 'Rodríguez',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI',
  })
  @IsNotEmpty()
  @IsString()
  documentType: string;

  @ApiProperty({
    description: 'Documento',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    description: 'IDs de las categorías asociadas',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
