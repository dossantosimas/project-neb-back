import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nombre de la categoría', example: 'Sub-20' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
    example: 'Categoría para jugadores menores de 20 años',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
