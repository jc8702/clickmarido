import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto, companyId: string) {
    const { clientId, discount = 0, travelFee = 0, materials = [], status = 'Rascunho', services } = createQuoteDto;

    // 1. Validar se o cliente existe e pertence à empresa
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId, deletedAt: null },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    // 2. Gerar número sequencial de orçamento para a empresa
    const maxQuote = await this.prisma.quote.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
    });
    const quoteNumber = maxQuote ? maxQuote.number + 1 : 1;

    // 3. Calcular valor total dos serviços
    let servicesTotal = 0;
    for (const item of services) {
      // Opcional: Validar se os serviços existem no catálogo
      const dbService = await this.prisma.service.findFirst({
        where: { id: item.serviceId, companyId, deletedAt: null },
      });
      if (!dbService) {
        throw new NotFoundException(`Serviço com ID ${item.serviceId} não encontrado no catálogo.`);
      }
      servicesTotal += item.quantity * item.value;
    }

    // 4. Calcular valor total dos materiais
    const materialsTotal = materials.reduce((sum, m) => sum + (m.quantity * m.value), 0);

    // 5. Calcular valor final
    const rawTotal = servicesTotal + materialsTotal + travelFee - discount;
    const totalValue = Math.max(0, rawTotal); // Evita totais negativos

    // 6. Criar orçamento e itens na transação Prisma
    const quote = await this.prisma.$transaction(async (tx) => {
      const newQuote = await tx.quote.create({
        data: {
          number: quoteNumber,
          companyId,
          clientId,
          discount,
          travelFee,
          materials: materials as any,
          totalValue,
          status,
        },
      });

      // Criar itens relacionados
      await tx.quoteService.createMany({
        data: services.map((s) => ({
          quoteId: newQuote.id,
          serviceId: s.serviceId,
          quantity: s.quantity,
          value: s.value,
        })),
      });

      return tx.quote.findUnique({
        where: { id: newQuote.id },
        include: {
          client: true,
          services: {
            include: {
              service: true,
            },
          },
        },
      });
    });

    return {
      success: true,
      data: quote,
    };
  }

  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    clientId?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (search) {
      // Se a busca for um número inteiro, filtra por número de orçamento. Caso contrário, filtra pelo nome do cliente.
      const searchNum = parseInt(search, 10);
      if (!isNaN(searchNum)) {
        where.number = searchNum;
      } else {
        where.client = {
          name: { contains: search, mode: 'insensitive' },
        };
      }
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { number: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
              whatsapp: true,
              email: true,
            },
          },
          services: {
            include: {
              service: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.quote.count({ where }),
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
    const quote = await this.prisma.quote.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    return {
      success: true,
      data: quote,
    };
  }

  async findPublicQuote(id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            phone: true,
            cnpj: true,
          }
        },
        client: {
          select: {
            name: true,
            email: true,
            cpf: true,
          }
        },
        services: {
          include: {
            service: {
              select: {
                name: true,
                description: true,
              }
            },
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado ou link expirado.');
    }

    return {
      success: true,
      data: quote,
    };
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto, companyId: string) {
    const existingQuote = await this.prisma.quote.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        services: true,
      },
    });

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    const {
      clientId,
      discount,
      travelFee,
      materials,
      status,
      services,
      signature,
    } = updateQuoteDto;

    // Se mudou o cliente, validar existência
    if (clientId && clientId !== existingQuote.clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, companyId, deletedAt: null },
      });
      if (!client) {
        throw new NotFoundException('Novo cliente não encontrado.');
      }
    }

    const updatedQuote = await this.prisma.$transaction(async (tx) => {
      // 1. Atualizar serviços se enviados
      if (services) {
        // Deleta serviços antigos
        await tx.quoteService.deleteMany({
          where: { quoteId: id },
        });

        // Cria novos serviços
        await tx.quoteService.createMany({
          data: services.map((s) => ({
            quoteId: id,
            serviceId: s.serviceId,
            quantity: s.quantity,
            value: s.value,
          })),
        });
      }

      // 2. Buscar serviços ativos no orçamento para cálculo de totais
      const activeServices = services || existingQuote.services.map(s => ({
        serviceId: s.serviceId,
        quantity: s.quantity,
        value: s.value,
      }));

      let servicesTotal = 0;
      for (const item of activeServices) {
        servicesTotal += item.quantity * item.value;
      }

      // 3. Materiais ativos
      const activeMaterials = materials !== undefined ? materials : (existingQuote.materials as any[] || []);
      const materialsTotal = activeMaterials.reduce((sum, m) => sum + (m.quantity * m.value), 0);

      // 4. Desconto e deslocamento ativos
      const activeDiscount = discount !== undefined ? discount : existingQuote.discount;
      const activeTravelFee = travelFee !== undefined ? travelFee : existingQuote.travelFee;

      // 5. Novo valor final
      const rawTotal = servicesTotal + materialsTotal + activeTravelFee - activeDiscount;
      const totalValue = Math.max(0, rawTotal);

      // 6. Atualizar orçamento
      const updateData: any = {
        totalValue,
      };

      if (clientId !== undefined) updateData.clientId = clientId;
      if (discount !== undefined) updateData.discount = discount;
      if (travelFee !== undefined) updateData.travelFee = travelFee;
      if (materials !== undefined) updateData.materials = materials as any;
      if (status !== undefined) updateData.status = status;
      if (signature !== undefined) {
        updateData.signature = signature;
        updateData.signedAt = new Date();
        // Se assinou, garante aprovação
        updateData.status = 'Aprovado';
      }

      await tx.quote.update({
        where: { id },
        data: updateData,
      });

      return tx.quote.findUnique({
        where: { id },
        include: {
          client: true,
          services: {
            include: {
              service: true,
            },
          },
        },
      });
    });

    return {
      success: true,
      data: updatedQuote,
    };
  }

  async saveSignature(id: string, signatureBase64: string, companyId: string) {
    const existingQuote = await this.prisma.quote.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    const updatedQuote = await this.prisma.quote.update({
      where: { id },
      data: {
        signature: signatureBase64,
        signedAt: new Date(),
        status: 'Aprovado',
      },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedQuote,
    };
  }

  async savePublicSignature(id: string, signatureBase64: string) {
    const existingQuote = await this.prisma.quote.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    if (existingQuote.status === 'Aprovado') {
      throw new BadRequestException('Orçamento já foi aprovado anteriormente.');
    }

    const updatedQuote = await this.prisma.quote.update({
      where: { id },
      data: {
        signature: signatureBase64,
        signedAt: new Date(),
        status: 'Aprovado',
      },
    });

    return {
      success: true,
      data: { id: updatedQuote.id, status: updatedQuote.status },
    };
  }

  async remove(id: string, companyId: string) {
    const existingQuote = await this.prisma.quote.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    await this.prisma.quote.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      data: { id },
    };
  }
}
