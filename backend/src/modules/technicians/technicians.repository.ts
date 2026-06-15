import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TechniciansRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TechnicianCreateInput) {
    return this.prisma.technician.create({ data });
  }

  async findMany(companyId: string) {
    return this.prisma.technician.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, companyId: string) {
    return this.prisma.technician.findFirst({
      where: { id, companyId, deletedAt: null },
    });
  }

  async update(id: string, data: Prisma.TechnicianUpdateInput) {
    return this.prisma.technician.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.technician.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'Inativo' },
    });
  }
}
