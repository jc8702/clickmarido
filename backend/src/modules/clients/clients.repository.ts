import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface ClientFilters {
  companyId: string;
  skip?: number;
  take?: number;
  search?: string;
  leadSource?: string;
  city?: string;
}

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCpfAndCompany(cpf: string, companyId: string) {
    return this.prisma.client.findFirst({
      where: { cpf, companyId, deletedAt: null },
    });
  }

  async findByIdAndCompany(id: string, companyId: string) {
    return this.prisma.client.findFirst({
      where: { id, companyId, deletedAt: null },
    });
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private buildWhereClause(filters: ClientFilters): Prisma.ClientWhereInput {
    const where: Prisma.ClientWhereInput = {
      companyId: filters.companyId,
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { cpf: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.leadSource) {
      where.leadSource = { equals: filters.leadSource, mode: 'insensitive' };
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    return where;
  }

  async findManyWithCount(filters: ClientFilters) {
    const where = this.buildWhereClause(filters);

    return this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);
  }

  async createWithHistory(
    clientData: Prisma.ClientUncheckedCreateInput,
    historyData: Prisma.ClientHistoryUncheckedCreateInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const createdClient = await tx.client.create({
        data: clientData,
      });

      await tx.clientHistory.create({
        data: {
          ...historyData,
          clientId: createdClient.id,
        },
      });

      return createdClient;
    });
  }

  async updateWithHistory(
    clientId: string,
    dataToUpdate: Prisma.ClientUpdateInput,
    historyData: Prisma.ClientHistoryUncheckedCreateInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const dbClient = await tx.client.update({
        where: { id: clientId },
        data: dataToUpdate,
      });

      await tx.clientHistory.create({
        data: {
          ...historyData,
          clientId,
        },
      });

      return dbClient;
    });
  }

  async softDeleteWithHistory(
    clientId: string,
    historyData: Prisma.ClientHistoryUncheckedCreateInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.client.update({
        where: { id: clientId },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.clientHistory.create({
        data: {
          ...historyData,
          clientId,
        },
      });
    });
  }

  async findHistory(clientId: string) {
    return this.prisma.clientHistory.findMany({
      where: { clientId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createHistory(data: Prisma.ClientHistoryUncheckedCreateInput) {
    return this.prisma.clientHistory.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
