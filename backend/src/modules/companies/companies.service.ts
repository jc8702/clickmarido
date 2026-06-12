import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { name, slug, cnpj, phone, email, address, city, state, active } = createCompanyDto;

    // Verifica se já existe empresa com o mesmo slug
    const existingSlug = await this.prisma.company.findUnique({
      where: { slug },
    });
    if (existingSlug && !existingSlug.deletedAt) {
      throw new BadRequestException('Já existe uma empresa cadastrada com este slug.');
    }

    // Verifica se já existe empresa com o mesmo CNPJ
    if (cnpj) {
      const existingCnpj = await this.prisma.company.findUnique({
        where: { cnpj },
      });
      if (existingCnpj && !existingCnpj.deletedAt) {
        throw new BadRequestException('Já existe uma empresa cadastrada com este CNPJ.');
      }
    }

    const company = await this.prisma.company.create({
      data: {
        name,
        slug,
        cnpj,
        phone,
        email,
        address,
        city,
        state,
        active: active ?? true,
      },
    });

    return {
      success: true,
      data: company,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    active?: boolean,
    state?: string,
  ) {
    const skip = (page - 1) * limit;

    // Filtros de busca
    const where: any = {
      deletedAt: null, // Ignora itens com soft delete
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (active !== undefined) {
      where.active = active;
    }

    if (state) {
      where.state = { equals: state, mode: 'insensitive' };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
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

  async findOne(id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada ou excluída.');
    }

    return {
      success: true,
      data: company,
    };
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.findFirst({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    // Se for alterar slug, valida unicidade
    if (updateCompanyDto.slug && updateCompanyDto.slug !== company.slug) {
      const existingSlug = await this.prisma.company.findUnique({
        where: { slug: updateCompanyDto.slug },
      });
      if (existingSlug && !existingSlug.deletedAt) {
        throw new BadRequestException('Já existe uma empresa com este slug.');
      }
    }

    // Se for alterar CNPJ, valida unicidade
    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingCnpj = await this.prisma.company.findUnique({
        where: { cnpj: updateCompanyDto.cnpj },
      });
      if (existingCnpj && !existingCnpj.deletedAt) {
        throw new BadRequestException('Já existe uma empresa com este CNPJ.');
      }
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });

    return {
      success: true,
      data: updatedCompany,
    };
  }

  async remove(id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    // Executa a inativação da empresa e de todos os usuários a ela associados em uma transação
    await this.prisma.$transaction([
      // 1. Soft delete da Empresa
      this.prisma.company.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          active: false,
        },
      }),
      // 2. Soft delete de todos os usuários associados a essa empresa
      this.prisma.user.updateMany({
        where: { companyId: id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          isActive: false,
        },
      }),
      // 3. Deleta sessões ativas desses usuários para forçar o deslogar
      this.prisma.session.deleteMany({
        where: {
          user: {
            companyId: id,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: { id },
    };
  }
}
