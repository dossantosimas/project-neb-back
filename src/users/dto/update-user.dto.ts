import {
  IsString,
  MinLength,
  IsOptional,
  IsIn,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/user.entity';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'newpassword123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Rol del usuario (1: Master, 2: Admin, 3: Coach, 4: Player, 5: User)',
    enum: UserRole,
    example: UserRole.ADMIN,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  role?: UserRole;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
