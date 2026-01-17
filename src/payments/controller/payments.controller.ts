import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentsService } from '../service/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Jugador no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los pagos o filtrar por jugador, mes y año',
  })
  @ApiQuery({
    name: 'playerId',
    required: false,
    type: Number,
    description: 'ID del jugador para filtrar pagos',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: Number,
    description: 'Mes (1-12) para filtrar pagos por fecha de pago',
    example: 1,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Año (YYYY) para filtrar pagos por fecha de pago',
    example: 2025,
  })
  @ApiResponse({ status: 200, description: 'Lista de pagos' })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos (mes o año)' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('playerId') playerId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;

    // Si se proporciona mes y año
    if (monthNum !== undefined && yearNum !== undefined) {
      // Si también se proporciona playerId, filtrar por todo
      if (playerId) {
        return this.paymentsService.findByMonthAndYearAndPlayer(
          monthNum,
          yearNum,
          parseInt(playerId, 10),
        );
      }
      // Solo filtrar por mes y año
      return this.paymentsService.findByMonthAndYear(monthNum, yearNum);
    }

    // Si solo se proporciona mes (sin año, usa año actual)
    if (monthNum !== undefined) {
      if (playerId) {
        return this.paymentsService.findByMonthAndPlayer(
          monthNum,
          parseInt(playerId, 10),
          yearNum, // puede ser undefined, usará año actual
        );
      }
      return this.paymentsService.findByMonth(monthNum, yearNum);
    }

    // Si solo se proporciona año (sin mes, muestra todo el año)
    if (yearNum !== undefined) {
      if (playerId) {
        return this.paymentsService.findByYearAndPlayer(
          yearNum,
          parseInt(playerId, 10),
        );
      }
      return this.paymentsService.findByYear(yearNum);
    }

    // Si solo se proporciona playerId, filtrar por jugador
    if (playerId) {
      return this.paymentsService.findByPlayer(parseInt(playerId, 10));
    }

    // Si no hay filtros, devolver todos los pagos
    return this.paymentsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @ApiOperation({ summary: 'Eliminar un pago' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 204, description: 'Pago eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}
