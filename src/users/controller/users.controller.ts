import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
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
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El username ya está en uso' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los usuarios con paginación',
    description:
      'Devuelve usuarios paginados. Si no se proporcionan page y limit, usa valores por defecto (page=1, limit=10).',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por username',
    example: 'juan',
  })
  @ApiQuery({
    name: 'documento',
    required: false,
    type: String,
    description: 'Filtrar por número de documento del perfil',
    example: '12345678',
  })
  @ApiQuery({
    name: 'nombre',
    required: false,
    type: String,
    description: 'Filtrar por nombre del perfil',
    example: 'Juan',
  })
  @ApiQuery({
    name: 'apellido',
    required: false,
    type: String,
    description: 'Filtrar por apellido del perfil',
    example: 'Pérez',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios paginada',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', description: 'Total de usuarios' },
            page: { type: 'number', description: 'Página actual' },
            limit: { type: 'number', description: 'Elementos por página' },
            totalPages: { type: 'number', description: 'Total de páginas' },
          },
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('documento') documento?: string,
    @Query('nombre') nombre?: string,
    @Query('apellido') apellido?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.usersService.findAll(
      pageNum,
      limitNum,
      search,
      documento,
      nombre,
      apellido,
    );
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
