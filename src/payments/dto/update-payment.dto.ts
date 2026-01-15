import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod } from '../entity/payment.entity';

export class UpdatePaymentDto {
  @ApiProperty({ description: 'ID del jugador', required: false })
  @IsOptional()
  @IsNumber()
  playerId?: number;

  @ApiProperty({ description: 'Valor del pago', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ description: 'Deuda pendiente', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  debt?: number;

  @ApiProperty({ description: 'Descripción del pago', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Estado del pago',
    enum: PaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Método de pago',
    enum: PaymentMethod,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Fecha del pago (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
