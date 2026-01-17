import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod } from '../entity/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Documento del jugador al que pertenece el pago',
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Valor del pago',
    example: 50000,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Deuda pendiente',
    example: 0,
    default: 0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  debt?: number;

  @ApiProperty({
    description: 'Descripción del pago',
    example: 'Pago mensualidad enero',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Estado del pago',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    default: PaymentStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Método de pago',
    enum: PaymentMethod,
    example: PaymentMethod.TRANSFER,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Fecha del pago (formato: YYYY-MM-DD)',
    example: '2026-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
