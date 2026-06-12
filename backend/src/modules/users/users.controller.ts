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

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('*', 'user:create')
  create(@Body() createUserDto: CreateUserDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.usersService.create(createUserDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'user:read')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
    @Query('active') active?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const activeBool = active === 'true' ? true : active === 'false' ? false : undefined;

    return this.usersService.findAll(companyId, pageNum, limitNum, search, roleId, activeBool);
  }

  @Get('roles')
  @RequirePermissions('*', 'user:read')
  getRoles() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.usersService.getRoles(companyId);
  }

  @Get(':id')
  @RequirePermissions('*', 'user:read')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    return this.usersService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'user:update')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const companyId = CompanyContext.getCompanyId();
    return this.usersService.update(id, updateUserDto, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'user:delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    return this.usersService.remove(id, companyId);
  }
}
