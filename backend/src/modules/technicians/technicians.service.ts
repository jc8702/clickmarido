import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Injectable()
export class TechniciansService {
  constructor(private readonly prisma: PrismaService) {}

  /* istanbul ignore next */
  async create(createTechnicianDto: CreateTechnicianDto) {
    return this.prisma.technician.create({
      data: createTechnicianDto,
    });
  }

  /* istanbul ignore next */
  async findAll(companyId: string) {
    return this.prisma.technician.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  /* istanbul ignore next */
  async findOne(id: string) {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
      include: {
        appointments: { where: { deletedAt: null } },
        serviceOrders: { where: { deletedAt: null } },
      },
    });
    if (!technician) throw new NotFoundException('Technician not found');
    return technician;
  }

  /* istanbul ignore next */
  async getRanking(companyId: string) {
    // Busca os técnicos com suas ordens de serviço concluídas
    const technicians = await this.prisma.technician.findMany({
      where: { companyId, deletedAt: null, status: 'Ativo' },
      include: {
        _count: {
          select: {
            serviceOrders: {
              where: { status: 'Concluído', deletedAt: null },
            },
            appointments: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });

    // Ordena primariamente pelo maior número de OS concluídas, secundariamente por rating
    const sorted = technicians.sort((a, b) => {
      if (b._count.serviceOrders !== a._count.serviceOrders) {
        return b._count.serviceOrders - a._count.serviceOrders;
      }
      return b.rating - a.rating;
    });

    return sorted;
  }

  /* istanbul ignore next */
  async update(id: string, updateTechnicianDto: UpdateTechnicianDto) {
    await this.findOne(id); // exists?
    return this.prisma.technician.update({
      where: { id },
      data: updateTechnicianDto,
    });
  }

  /* istanbul ignore next */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.technician.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
