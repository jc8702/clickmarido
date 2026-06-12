import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto, companyId: string) {
    const { category, name, description, value, averageTime, complexity, warranty, specialty, active } = createServiceDto;

    const service = await this.prisma.service.create({
      data: {
        category,
        name,
        description,
        value,
        averageTime,
        complexity,
        warranty,
        specialty,
        active: active ?? true,
        companyId,
      },
    });

    return {
      success: true,
      data: service,
    };
  }

  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    complexity?: string,
    active?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (complexity) {
      where.complexity = { equals: complexity, mode: 'insensitive' };
    }

    if (active !== undefined) {
      where.active = active;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { category: 'asc' },
      }),
      this.prisma.service.count({ where }),
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

  async findOne(id: string, companyId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado ou excluído.');
    }

    return {
      success: true,
      data: service,
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, companyId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });

    return {
      success: true,
      data: updatedService,
    };
  }

  async remove(id: string, companyId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    await this.prisma.service.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
      },
    });

    return {
      success: true,
      data: { id },
    };
  }

  async exportCsv(companyId: string): Promise<string> {
    const services = await this.prisma.service.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { category: 'asc' },
    });

    // Cabeçalho do CSV
    let csv = 'Categoria;Nome;Descrição;Valor;Tempo Médio (min);Complexidade;Garantia (dias);Especialidade;Status\n';

    for (const s of services) {
      const description = s.description ? s.description.replace(/[\n\r;]/g, ' ') : '';
      const specialty = s.specialty ? s.specialty.replace(/[\n\r;]/g, ' ') : '';
      const status = s.active ? 'Ativo' : 'Inativo';

      csv += `${s.category};${s.name};${description};${s.value};${s.averageTime};${s.complexity};${s.warranty};${specialty};${status}\n`;
    }

    return csv;
  }

  async validateCsv(csvContent: string, companyId: string) {
    if (!csvContent || csvContent.trim() === '') {
      throw new BadRequestException('Conteúdo do arquivo CSV vazio.');
    }

    const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length <= 1) {
      throw new BadRequestException('O CSV deve conter pelo menos uma linha de dados além do cabeçalho.');
    }

    const dataLines = lines.slice(1);
    const results = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const index = i + 2; // Linha 1 é o cabeçalho
      const columns = line.split(/[;,]/).map((col) => col.trim());
      
      const errors: string[] = [];
      let isValid = true;

      // Valida quantidade mínima de colunas
      if (columns.length < 4) {
        errors.push(`Estrutura inválida: a linha possui apenas ${columns.length} colunas (mínimo esperado: 4).`);
        isValid = false;
      }

      const category = columns[0] || '';
      const name = columns[1] || '';
      const description = columns[2] || '';
      const rawValue = columns[3] || '0';
      const rawTime = columns[4] || '0';
      const complexity = columns[5] || 'Média';
      const rawWarranty = columns[6] || '0';
      const specialty = columns[7] || '';
      const rawActive = columns[8] || 'Ativo';

      // Validações de Regra de Negócio
      if (!name) {
        errors.push('O Nome do serviço é obrigatório.');
        isValid = false;
      }

      if (!category) {
        errors.push('A Categoria é obrigatória.');
        isValid = false;
      } else if (!['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'].includes(category)) {
        errors.push(`Categoria inválida: '${category}' (Permitidas: Elétrica, Hidráulica, Instalações, Marcenaria).`);
        isValid = false;
      }

      const value = parseFloat(rawValue.replace(',', '.')) || 0;
      if (isNaN(value) || value <= 0) {
        errors.push(`Valor inválido: '${rawValue}' (Deve ser um número maior que zero).`);
        isValid = false;
      }

      const averageTime = parseInt(rawTime, 10) || 0;
      if (isNaN(averageTime) || averageTime <= 0) {
        errors.push(`Tempo médio inválido: '${rawTime}' (Deve ser um número inteiro de minutos maior que zero).`);
        isValid = false;
      }

      const warranty = parseInt(rawWarranty, 10) || 0;
      if (isNaN(warranty) || warranty < 0) {
        errors.push(`Garantia inválida: '${rawWarranty}' (Deve ser um número de dias maior ou igual a zero).`);
        isValid = false;
      }

      if (!['Baixa', 'Média', 'Alta'].includes(complexity)) {
        errors.push(`Complexidade inválida: '${complexity}' (Permitidas: Baixa, Média, Alta).`);
        isValid = false;
      }

      const active = rawActive === 'Inativo' ? false : true;

      let action: 'CREATE' | 'UPDATE' | 'NONE' = 'CREATE';

      if (isValid) {
        // Verifica se o serviço já existe na base
        const existing = await this.prisma.service.findFirst({
          where: { name, category, companyId, deletedAt: null },
        });

        if (existing) {
          action = 'UPDATE';
        }
      } else {
        action = 'NONE';
      }

      results.push({
        index,
        isValid,
        action,
        errors,
        service: {
          category,
          name,
          description: description || null,
          value,
          averageTime,
          complexity,
          warranty,
          specialty: specialty || null,
          active,
        },
      });
    }

    return {
      success: true,
      data: results,
    };
  }

  async confirmImport(items: any[], companyId: string) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Nenhum item válido para importação fornecido.');
    }

    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        try {
          const { category, name, description, value, averageTime, complexity, warranty, specialty, active } = item.service;

          if (item.action === 'UPDATE') {
            const existing = await tx.service.findFirst({
              where: { name, category, companyId, deletedAt: null },
            });

            if (existing) {
              await tx.service.update({
                where: { id: existing.id },
                data: {
                  description,
                  value,
                  averageTime,
                  complexity,
                  warranty,
                  specialty,
                  active,
                },
              });
              updatedCount++;
            } else {
              // Se por algum motivo sumiu nesse meio tempo, cria
              await tx.service.create({
                data: {
                  category,
                  name,
                  description,
                  value,
                  averageTime,
                  complexity,
                  warranty,
                  specialty,
                  active,
                  companyId,
                },
              });
              createdCount++;
            }
          } else if (item.action === 'CREATE') {
            await tx.service.create({
              data: {
                category,
                name,
                description,
                value,
                averageTime,
                complexity,
                warranty,
                specialty,
                active,
                companyId,
              },
            });
            createdCount++;
          }
        } catch (err) {
          errorCount++;
        }
      }
    });

    return {
      success: true,
      data: {
        totalProcessed: items.length,
        createdCount,
        updatedCount,
        errorCount,
      },
    };
  }
}
