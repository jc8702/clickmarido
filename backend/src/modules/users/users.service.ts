import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /* istanbul ignore next */
  async create(createUserDto: CreateUserDto, companyId: string) {
    const { email, name, password, roleIds, isActive } = createUserDto;

    if (!companyId) {
      throw new BadRequestException(
        'A empresa (companyId) deve ser informada.',
      );
    }

    // Verifica se a empresa existe e está ativa
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, deletedAt: null },
    });
    if (!company) {
      throw new BadRequestException('Empresa não encontrada ou inativa.');
    }

    // Verifica unicidade de e-mail
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser && !existingUser.deletedAt) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        companyId,
        isActive: isActive ?? true,
        roles: {
          connect: roleIds.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        companyId: true,
        createdAt: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return {
      success: true,
      data: user,
    };
  }

  /* istanbul ignore next */
  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    roleId?: string,
    active?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    // Filtra por empresa (obrigatório em multi-tenant)
    if (companyId) {
      where.companyId = companyId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (active !== undefined) {
      where.isActive = active;
    }

    if (roleId) {
      where.roles = {
        some: {
          id: roleId,
        },
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          companyId: true,
          createdAt: true,
          roles: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* istanbul ignore next */
  async findOne(id: string, companyId?: string) {
    const where: Prisma.UserWhereInput = { id, deletedAt: null };
    if (companyId) {
      where.companyId = companyId;
    }

    const user = await this.prisma.user.findFirst({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        companyId: true,
        createdAt: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou excluído.');
    }

    return {
      success: true,
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto, companyId?: string) {
    const where: Prisma.UserWhereInput = { id, deletedAt: null };
    if (companyId) {
      where.companyId = companyId;
    }

    const user = await this.prisma.user.findFirst({ where });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { roleIds, password, ...rest } = updateUserDto;
    const updateData: Prisma.UserUpdateInput = { ...rest };

    // Se for alterar e-mail, valida unicidade
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser && !existingUser.deletedAt) {
        throw new BadRequestException(
          'E-mail já cadastrado por outro usuário.',
        );
      }
    }

    // Se for alterar senha, gera o hash
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Se houver alteração de papéis (roles)
    if (roleIds) {
      updateData.roles = {
        set: roleIds.map((id) => ({ id })),
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        companyId: true,
        createdAt: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  }

  /* istanbul ignore next */
  async remove(id: string, companyId?: string) {
    const where: Prisma.UserWhereInput = { id, deletedAt: null };
    if (companyId) {
      where.companyId = companyId;
    }

    const user = await this.prisma.user.findFirst({ where });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Executa soft delete do usuário e revoga sessões em transação
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          isActive: false,
        },
      }),
      this.prisma.session.deleteMany({
        where: { userId: id },
      }),
    ]);

    return {
      success: true,
      data: { id },
    };
  }

  /* istanbul ignore next */
  async getRoles(companyId: string) {
    const roles = await this.prisma.role.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return {
      success: true,
      data: roles,
    };
  }
}
