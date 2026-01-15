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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CoachesService } from '../service/coaches.service';
import { CreateCoachDto } from '../dto/create-coach.dto';
import { UpdateCoachDto } from '../dto/update-coach.dto';

@ApiTags('coaches')
@ApiBearerAuth('JWT-auth')
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @ApiOperation({ summary: 'Crear un nuevo coach (crea usuario y perfil)' })
  @ApiResponse({ status: 201, description: 'Coach creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 409, description: 'Username ya está en uso' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @ApiOperation({ summary: 'Obtener todos los coaches' })
  @ApiResponse({ status: 200, description: 'Lista de coaches' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.coachesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un coach por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Coach encontrado' })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un coach' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Coach actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoachDto: UpdateCoachDto,
  ) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @ApiOperation({ summary: 'Eliminar un coach' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 204, description: 'Coach eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.remove(id);
  }
}
