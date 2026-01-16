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
import { MatchesService } from '../service/matches.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';

@ApiTags('matches')
@ApiBearerAuth('JWT-auth')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Crear un nuevo partido' })
  @ApiResponse({ status: 201, description: 'Partido creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado' })
  @ApiResponse({ status: 400, description: 'Los equipos deben ser diferentes' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @ApiOperation({ summary: 'Obtener todos los partidos' })
  @ApiResponse({ status: 200, description: 'Lista de partidos' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un partido por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Partido encontrado' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un partido' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Partido actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @ApiOperation({ summary: 'Eliminar un partido' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Partido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.remove(id);
  }
}
