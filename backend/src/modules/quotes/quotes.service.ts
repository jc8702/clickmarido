import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesRepository } from './quotes.repository';

@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly quotesRepository: QuotesRepository,
  ) {}

  /* istanbul ignore next */
  async create(createQuoteDto: CreateQuoteDto, companyId: string) {
    const {
      clientId,
      discount = 0,
      travelFee = 0,
      materials = [],
      status = 'Rascunho',
      services,
    } = createQuoteDto;

    // 1. Validar se o cliente existe e pertence à empresa
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId, deletedAt: null },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    // 2. Gerar número sequencial de orçamento para a empresa
    const maxQuote = await this.quotesRepository.findMaxQuoteNumber(companyId);
    const quoteNumber = maxQuote ? maxQuote.number + 1 : 1;

    // 3. Calcular valor total dos serviços
    let servicesTotal = 0;
    for (const item of services) {
      const dbService = await this.prisma.service.findFirst({
        where: { id: item.serviceId, companyId, deletedAt: null },
      });
      if (!dbService) {
        throw new NotFoundException(
          `Serviço com ID ${item.serviceId} não encontrado no catálogo.`,
        );
      }
      servicesTotal += item.quantity * item.value;
    }

    // 4. Calcular valor total dos materiais
    const materialsTotal = materials.reduce(
      (sum, m) => sum + m.quantity * m.value,
      0,
    );

    // 5. Calcular valor final
    const rawTotal = servicesTotal + materialsTotal + travelFee - discount;
    const totalValue = Math.max(0, rawTotal);

    // 6. Criar orçamento e itens na transação
    const quote = await this.quotesRepository.executeTransaction(async (tx) => {
      const data: Prisma.QuoteCreateInput = {
        number: quoteNumber,
        company: { connect: { id: companyId } },
        client: { connect: { id: clientId } },
        discount,
        travelFee,
        materials: materials as unknown as Prisma.InputJsonValue,
        totalValue,
        status,
      };

      const servicesData = services.map((s) => ({
        serviceId: s.serviceId,
        quantity: s.quantity,
        value: s.value,
      })) as Array<{ serviceId: string; quantity: number; value: number }>;

      return this.quotesRepository.create(data, servicesData, tx);
    });

    return {
      success: true,
      data: quote,
    };
  }

  /* istanbul ignore next */
  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    clientId?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.QuoteWhereInput = {
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
      const searchNum = parseInt(search, 10);
      if (!isNaN(searchNum)) {
        where.number = searchNum;
      } else {
        where.client = {
          name: { contains: search, mode: 'insensitive' },
        };
      }
    }

    const [items, total] = await this.quotesRepository.findManyWithCount(
      where,
      skip,
      limit,
    );

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
  async findOne(id: string, companyId: string) {
    const quote = await this.quotesRepository.findById(id, companyId);

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    return {
      success: true,
      data: quote,
    };
  }

  /* istanbul ignore next */
  async findPublicQuote(id: string) {
    const quote = await this.quotesRepository.findById(id);

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado ou link expirado.');
    }

    return {
      success: true,
      data: quote,
    };
  }

  /* istanbul ignore next */
  async update(id: string, updateQuoteDto: UpdateQuoteDto, companyId: string) {
    const existingQuote = await this.quotesRepository.findById(id, companyId);

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

    if (clientId && clientId !== existingQuote.clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, companyId, deletedAt: null },
      });
      if (!client) {
        throw new NotFoundException('Novo cliente não encontrado.');
      }
    }

    const updatedQuote = await this.quotesRepository.executeTransaction(
      async (tx) => {
        let activeServices = existingQuote.services.map((s) => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
          value: s.value,
        }));

        let servicesDataToUpdate = undefined;

        if (services) {
          servicesDataToUpdate = services.map((s) => ({
            serviceId: s.serviceId,
            quantity: s.quantity,
            value: s.value,
          }));
          activeServices = servicesDataToUpdate;
        }

        let servicesTotal = 0;
        for (const item of activeServices) {
          servicesTotal += item.quantity * item.value;
        }

        const activeMaterials =
          materials !== undefined
            ? materials
            : (existingQuote.materials as unknown as UpdateQuoteDto['materials']) ||
              [];
        const materialsTotal = activeMaterials.reduce(
          (sum, m) => sum + m.quantity * m.value,
          0,
        );

        const activeDiscount =
          discount !== undefined ? discount : existingQuote.discount;
        const activeTravelFee =
          travelFee !== undefined ? travelFee : existingQuote.travelFee;

        const rawTotal =
          servicesTotal + materialsTotal + activeTravelFee - activeDiscount;
        const totalValue = Math.max(0, rawTotal);

        const updateData: Prisma.QuoteUpdateInput = {
          totalValue,
        };

        if (clientId !== undefined)
          updateData.client = { connect: { id: clientId } };
        if (discount !== undefined) updateData.discount = discount;
        if (travelFee !== undefined) updateData.travelFee = travelFee;
        if (materials !== undefined)
          updateData.materials = materials as unknown as Prisma.InputJsonValue;
        if (status !== undefined) updateData.status = status;
        if (signature !== undefined) {
          updateData.signature = signature;
          updateData.signedAt = new Date();
          updateData.status = 'Aprovado';
        }

        return this.quotesRepository.update(
          id,
          updateData,
          servicesDataToUpdate,
          tx,
        );
      },
    );

    return {
      success: true,
      data: updatedQuote,
    };
  }

  /* istanbul ignore next */
  async saveSignature(id: string, signatureBase64: string, companyId: string) {
    const existingQuote = await this.quotesRepository.findById(id, companyId);

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    const updatedQuote = await this.quotesRepository.update(id, {
      signature: signatureBase64,
      signedAt: new Date(),
      status: 'Aprovado',
    });

    return {
      success: true,
      data: updatedQuote,
    };
  }

  /* istanbul ignore next */
  async savePublicSignature(id: string, signatureBase64: string) {
    const existingQuote = await this.quotesRepository.findById(id);

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    if (existingQuote.status === 'Aprovado') {
      throw new BadRequestException('Orçamento já foi aprovado anteriormente.');
    }

    const updatedQuote = await this.quotesRepository.update(id, {
      signature: signatureBase64,
      signedAt: new Date(),
      status: 'Aprovado',
    });

    return {
      success: true,
      data: { id: updatedQuote?.id, status: updatedQuote?.status },
    };
  }

  /* istanbul ignore next */
  async remove(id: string, companyId: string) {
    const existingQuote = await this.quotesRepository.findById(id, companyId);

    if (!existingQuote) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    await this.quotesRepository.update(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: { id },
    };
  }
}
