import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TournamentsService } from '../service/tournaments.service';
import { CreateTournamentDto } from '../dto/create-tournament.dto';
import { UpdateTournamentDto } from '../dto/update-tournament.dto';

@ApiTags('tournaments')
@ApiBearerAuth('JWT-auth')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiOperation({ summary: 'Crear un nuevo torneo' })
  @ApiResponse({ status: 201, description: 'Torneo creado exitosamente' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @ApiOperation({ summary: 'Obtener todos los torneos' })
  @ApiResponse({ status: 200, description: 'Lista de torneos' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un torneo por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Torneo encontrado' })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un torneo' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Torneo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @ApiOperation({ summary: 'Eliminar un torneo' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Torneo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.remove(id);
  }
}
