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
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto';
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

@Controller('materials')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Materials')
@ApiBearerAuth('JWT-auth')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @RequirePermissions('*', 'material:create')
  @ApiOperation({ summary: 'Criar Materials' })
  @ApiCreatedResponse({ description: 'Materials criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  create(@Body() createMaterialDto: CreateMaterialDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.materialsService.create(createMaterialDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'material:read')
  @ApiOperation({ summary: 'Listar todos Materials' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const lowStockBool = lowStock === 'true';

    return this.materialsService.findAll(
      companyId,
      pageNum,
      limitNum,
      search,
      category,
      lowStockBool,
    );
  }

  @Get(':id')
  @RequirePermissions('*', 'material:read')
  @ApiOperation({ summary: 'Buscar um Materials' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.materialsService.findOne(id, companyId);
  }

  @Get(':id/movements')
  @RequirePermissions('*', 'material:read')
  @ApiOperation({ summary: 'Operation findMovements' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findMovements(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.materialsService.findMovements(
      id,
      companyId,
      pageNum,
      limitNum,
    );
  }

  @Post(':id/movements')
  @RequirePermissions('*', 'material:movement')
  @ApiOperation({ summary: 'Operation createMovement' })
  @ApiCreatedResponse({ description: 'Materials criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  createMovement(
    @Param('id') id: string,
    @Body() dto: CreateMaterialMovementDto,
  ) {
    const companyId = CompanyContext.getCompanyId();
    const userId = CompanyContext.getUserId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.materialsService.createMovement(
      id,
      companyId,
      userId ?? null,
      dto,
    );
  }

  @Put(':id')
  @RequirePermissions('*', 'material:update')
  @ApiOperation({ summary: 'Atualizar Materials' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.materialsService.update(id, updateMaterialDto, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'material:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover Materials' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.materialsService.remove(id, companyId);
  }
}
