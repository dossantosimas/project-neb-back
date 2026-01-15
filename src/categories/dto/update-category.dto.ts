import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Sub-12',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
