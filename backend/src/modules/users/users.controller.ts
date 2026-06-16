import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('*', 'user:create')
  @ApiOperation({ summary: 'Criar Users' })
  @ApiCreatedResponse({ description: 'Users criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  create(@Body() createUserDto: CreateUserDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.usersService.create(createUserDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'user:read')
  @ApiOperation({ summary: 'Listar todos Users' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
    @Query('active') active?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const activeBool =
      active === 'true' ? true : active === 'false' ? false : undefined;

    return this.usersService.findAll(
      companyId,
      pageNum,
      limitNum,
      search,
      roleId,
      activeBool,
    );
  }

  @Get('roles')
  @RequirePermissions('*', 'user:read')
  @ApiOperation({ summary: 'Operation getRoles' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getRoles() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.usersService.getRoles(companyId);
  }

  @Get(':id')
  @RequirePermissions('*', 'user:read')
  @ApiOperation({ summary: 'Buscar um Users' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    return this.usersService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'user:update')
  @ApiOperation({ summary: 'Atualizar Users' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const companyId = CompanyContext.getCompanyId();
    return this.usersService.update(id, updateUserDto, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'user:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover Users' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    return this.usersService.remove(id, companyId);
  }
}
