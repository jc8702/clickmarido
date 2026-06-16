import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ServiceOrderCreateInput) {
    return this.prisma.serviceOrder.create({ data });
  }

  async findMany(companyId: string) {
    return this.prisma.serviceOrder.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, name: true } },
      },
    });
  }

  async findById(id: string, companyId: string) {
    return this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        client: true,
        appointments: true,
      },
    });
  }

  async update(id: string, data: Prisma.ServiceOrderUpdateInput) {
    return this.prisma.serviceOrder.update({
      where: { id },
      data,
    });
  }
}
