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
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('companies')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Companies')
@ApiBearerAuth('JWT-auth')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @RequirePermissions('*')
  @ApiOperation({ summary: 'Criar Companies' })
  @ApiCreatedResponse({ description: 'Companies criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' }) // Somente Admin Global pode cadastrar empresas
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @RequirePermissions('*')
  @ApiOperation({ summary: 'Listar todos Companies' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' }) // Somente Admin Global pode listar todas as empresas
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('active') active?: string,
    @Query('state') state?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const activeBool =
      active === 'true' ? true : active === 'false' ? false : undefined;

    return this.companiesService.findAll(
      pageNum,
      limitNum,
      search,
      activeBool,
      state,
    );
  }

  @Get(':id')
  @RequirePermissions('*')
  @ApiOperation({ summary: 'Buscar um Companies' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('*')
  @ApiOperation({ summary: 'Atualizar Companies' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @RequirePermissions('*')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover Companies' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
