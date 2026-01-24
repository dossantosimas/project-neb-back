import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCompleteDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Nombre del perfil' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Apellido del perfil' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({ description: 'Tipo de documento (CC, TI, CE, etc.)' })
  @IsNotEmpty()
  @IsString()
  tipoDocumento: string;

  @ApiProperty({ description: 'Número de documento' })
  @IsNotEmpty()
  @IsString()
  numeroDocumento: string;
}
