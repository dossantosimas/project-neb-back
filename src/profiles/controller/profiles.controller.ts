import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
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
import { ProfilesService } from '../service/profiles.service';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { CreatePlayerProfileDto } from '../dto/create-player-profile.dto';
import { CreateCoachProfileDto } from '../dto/create-coach-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePlayerProfileDto } from '../dto/update-player-profile.dto';
import { UpdateCoachProfileDto } from '../dto/update-coach-profile.dto';

@ApiTags('profiles')
@ApiBearerAuth('JWT-auth')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Crear un nuevo perfil' })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario o categoría no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil de este tipo' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    console.log('📥 DTO recibido en backend:', JSON.stringify(createProfileDto, null, 2));
    return this.profilesService.createProfile(createProfileDto);
  }

  @ApiOperation({ summary: 'Crear un nuevo perfil de jugador' })
  @ApiResponse({
    status: 201,
    description: 'Perfil de jugador creado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @ApiResponse({ status: 400, description: 'El perfil debe ser de tipo player' })
  @ApiResponse({ status: 409, description: 'Ya existe un PlayerProfile para este perfil' })
  @UseGuards(AuthGuard('jwt'))
  @Post('player')
  @HttpCode(HttpStatus.CREATED)
  createPlayerProfile(@Body() createPlayerProfileDto: CreatePlayerProfileDto) {
    return this.profilesService.createPlayerProfile(createPlayerProfileDto);
  }

  @ApiOperation({ summary: 'Crear un nuevo perfil de entrenador' })
  @ApiResponse({
    status: 201,
    description: 'Perfil de entrenador creado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @ApiResponse({ status: 400, description: 'El perfil debe ser de tipo coach' })
  @ApiResponse({ status: 409, description: 'Ya existe un CoachProfile para este perfil' })
  @UseGuards(AuthGuard('jwt'))
  @Post('coach')
  @HttpCode(HttpStatus.CREATED)
  createCoachProfile(@Body() createCoachProfileDto: CreateCoachProfileDto) {
    return this.profilesService.createCoachProfile(createCoachProfileDto);
  }

  @ApiOperation({ summary: 'Obtener un perfil por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un perfil' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del perfil' })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Actualizar un perfil de jugador' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del perfil de jugador',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de jugador actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de jugador no encontrado',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('player/:id')
  updatePlayerProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerProfileDto: UpdatePlayerProfileDto,
  ) {
    return this.profilesService.updatePlayerProfile(id, updatePlayerProfileDto);
  }

  @ApiOperation({ summary: 'Actualizar un perfil de entrenador' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del perfil de entrenador',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de entrenador actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de entrenador no encontrado',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('coach/:id')
  updateCoachProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoachProfileDto: UpdateCoachProfileDto,
  ) {
    return this.profilesService.updateCoachProfile(id, updateCoachProfileDto);
  }
}
