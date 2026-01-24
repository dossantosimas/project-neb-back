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
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los pagos con filtros avanzados',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'ID del usuario para filtrar pagos',
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
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Fecha de inicio (YYYY-MM-DD) para filtrar pagos',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Fecha de fin (YYYY-MM-DD) para filtrar pagos',
    example: '2025-12-31',
  })
  @ApiQuery({
    name: 'minAmount',
    required: false,
    type: Number,
    description: 'Monto mínimo del pago',
    example: 1000,
  })
  @ApiQuery({
    name: 'maxAmount',
    required: false,
    type: Number,
    description: 'Monto máximo del pago',
    example: 100000,
  })
  @ApiQuery({
    name: 'minDebt',
    required: false,
    type: Number,
    description: 'Deuda mínima',
    example: 0,
  })
  @ApiQuery({
    name: 'maxDebt',
    required: false,
    type: Number,
    description: 'Deuda máxima',
    example: 50000,
  })
  @ApiQuery({
    name: 'hasDebt',
    required: false,
    type: Boolean,
    description: 'Filtrar pagos con deuda (true) o sin deuda (false)',
    example: true,
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
    description: 'Buscar en la descripción del pago (búsqueda parcial)',
    example: 'mensualidad',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginación (por defecto: 1). Si se proporciona page o limit, se activa la paginación',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por página (por defecto: 10). Si se proporciona page o limit, se activa la paginación',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos. Si se usa paginación (page/limit), devuelve { data: Payment[], meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage } }',
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
    @Query('minDebt') minDebt?: string,
    @Query('maxDebt') maxDebt?: string,
    @Query('hasDebt') hasDebt?: string,
    @Query('description') description?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};

    if (userId) filters.userId = parseInt(userId, 10);
    if (month) filters.month = parseInt(month, 10);
    if (year) filters.year = parseInt(year, 10);
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minAmount) filters.minAmount = parseFloat(minAmount);
    if (maxAmount) filters.maxAmount = parseFloat(maxAmount);
    if (minDebt) filters.minDebt = parseFloat(minDebt);
    if (maxDebt) filters.maxDebt = parseFloat(maxDebt);
    if (hasDebt !== undefined) {
      filters.hasDebt = hasDebt === 'true' || hasDebt === '1';
    }
    if (description) filters.description = description;
    if (page) filters.page = parseInt(page, 10);
    if (limit) filters.limit = parseInt(limit, 10);

    return this.paymentsService.findAll(filters);
  }

  @ApiOperation({
    summary:
      'Obtener el último pago de un usuario/perfil según la fecha de pago',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: Number,
    description: 'ID del usuario/perfil del que se desea obtener el último pago',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Último pago del usuario. Incluye información (userName, userLastName)',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado o sin pagos' })
  @UseGuards(AuthGuard('jwt'))
  @Get('latest')
  findLatest(@Query('userId', ParseIntPipe) userId: number) {
    return this.paymentsService.findLatestPayment(userId);
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
