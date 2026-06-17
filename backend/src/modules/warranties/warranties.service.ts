import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

export interface CreateWarrantyInput {
  clientId: string;
  serviceOrderId?: string;
  type: string;
  description?: string;
  startDate?: string | Date;
}

@Injectable()
export class WarrantiesService {
  constructor(private prisma: PrismaService) {}

  /* istanbul ignore next */
  async create(companyId: string, data: CreateWarrantyInput) {
    const { clientId, serviceOrderId, type, description, startDate } = data;

    // Calcular endDate baseado no tipo
    let daysToAdd = 30; // Padrão
    if (type === 'ELETRICA' || type === 'HIDRAULICA') daysToAdd = 90;
    else if (type === 'INSTALACAO') daysToAdd = 60;
    else if (type === 'MARCENARIA') daysToAdd = 30;

    const start = startDate ? new Date(startDate) : new Date();
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Determinar status logo na criação caso mandem com data do passado
    let status = 'ACTIVE';
    if (endDate < new Date()) {
      status = 'EXPIRED';
    }

    return this.prisma.warranty.create({
      data: {
        companyId,
        clientId,
        serviceOrderId: serviceOrderId ?? '',
        type,
        description,
        startDate: start,
        endDate,
        status,
      },
    });
  }

  /* istanbul ignore next */
  async findAll(companyId: string) {
    return this.prisma.warranty.findMany({
      where: { companyId },
      include: {
        client: { select: { name: true } },
        serviceOrder: { select: { number: true } },
      },
      orderBy: { endDate: 'asc' },
    });
  }

  /* istanbul ignore next */
  async findOne(id: string, companyId: string) {
    const warranty = await this.prisma.warranty.findUnique({
      where: { id, companyId },
      include: {
        client: true,
        serviceOrder: true,
      },
    });

    if (!warranty) throw new NotFoundException('Garantia não encontrada');
    return warranty;
  }

  /* istanbul ignore next */
  async updateStatus(id: string, companyId: string, status: string) {
    return this.prisma.warranty.update({
      where: { id, companyId },
      data: { status },
    });
  }

  /* istanbul ignore next */
  async remove(id: string, companyId: string) {
    return this.prisma.warranty.delete({
      where: { id, companyId },
    });
  }
}
