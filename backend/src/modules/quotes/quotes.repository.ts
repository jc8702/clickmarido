import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.QuoteCreateInput,
    servicesData: Prisma.QuoteServiceCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || this.prisma;

    const quote = await prismaClient.quote.create({
      data,
    });

    if (servicesData && servicesData.length > 0) {
      const mappedServices = servicesData.map((s) => ({
        ...s,
        quoteId: quote.id,
      }));
      await prismaClient.quoteService.createMany({
        data: mappedServices,
      });
    }

    return prismaClient.quote.findUnique({
      where: { id: quote.id },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async findMaxQuoteNumber(companyId: string) {
    return this.prisma.quote.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
    });
  }

  async findManyWithCount(
    where: Prisma.QuoteWhereInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.$transaction([
      this.prisma.quote.findMany({
        where,
        skip,
        take,
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
  }

  async findById(
    id: string,
    companyId?: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || this.prisma;
    const where: Prisma.QuoteWhereInput = { id, deletedAt: null };
    if (companyId) {
      where.companyId = companyId;
    }

    return prismaClient.quote.findFirst({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            phone: true,
            cnpj: true,
          },
        },
        client: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.QuoteUpdateInput,
    servicesData?: Array<{
      serviceId: string;
      quantity: number;
      value: number;
    }>,
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || this.prisma;

    if (servicesData) {
      await prismaClient.quoteService.deleteMany({
        where: { quoteId: id },
      });

      if (servicesData.length > 0) {
        await prismaClient.quoteService.createMany({
          data: servicesData.map((s) => ({ ...s, quoteId: id })),
        });
      }
    }

    await prismaClient.quote.update({
      where: { id },
      data,
    });

    return prismaClient.quote.findUnique({
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
  }

  async executeTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
