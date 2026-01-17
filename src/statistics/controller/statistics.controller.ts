import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
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
import { StatisticsService } from '../service/statistics.service';
import { CreateStatisticsDto } from '../dto/create-statistics.dto';
import { UpdateStatisticsDto } from '../dto/update-statistics.dto';

@ApiTags('statistics')
@ApiBearerAuth('JWT-auth')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Crear nuevas estadísticas de un jugador en un partido' })
  @ApiResponse({ status: 201, description: 'Estadísticas creadas exitosamente' })
  @ApiResponse({ status: 404, description: 'Jugador o partido no encontrado' })
  @ApiResponse({ status: 400, description: 'Estadísticas duplicadas o datos inválidos' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStatisticsDto: CreateStatisticsDto) {
    return this.statisticsService.create(createStatisticsDto);
  }

  @ApiOperation({ summary: 'Obtener todas las estadísticas' })
  @ApiResponse({ status: 200, description: 'Lista de estadísticas' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener estadísticas por jugador o partido' })
  @ApiQuery({ name: 'playerProfileId', type: 'number', required: false })
  @ApiQuery({ name: 'matchId', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'Lista de estadísticas' })
  @UseGuards(AuthGuard('jwt'))
  @Get('filter')
  findByFilter(
    @Query('playerProfileId') playerProfileId?: string,
    @Query('matchId') matchId?: string,
  ) {
    if (playerProfileId) {
      return this.statisticsService.findByPlayer(parseInt(playerProfileId, 10));
    }
    if (matchId) {
      return this.statisticsService.findByMatch(parseInt(matchId, 10));
    }
    return this.statisticsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener estadísticas por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Estadísticas encontradas' })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statisticsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar estadísticas' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Estadísticas actualizadas exitosamente' })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatisticsDto: UpdateStatisticsDto,
  ) {
    return this.statisticsService.update(id, updateStatisticsDto);
  }

  @ApiOperation({ summary: 'Eliminar estadísticas' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 204, description: 'Estadísticas eliminadas exitosamente' })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statisticsService.remove(id);
  }
}
