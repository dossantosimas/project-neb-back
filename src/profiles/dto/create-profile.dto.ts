import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ description: 'ID de la categoría' })
  @IsNumber()
  @IsOptional()
  categoriaId?: number | null;

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
