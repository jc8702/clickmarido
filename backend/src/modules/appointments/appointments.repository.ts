import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface AppointmentFilters {
  companyId: string;
  startDate?: string;
  endDate?: string;
  technicianId?: string;
  clientId?: string;
}

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findClient(clientId: string, companyId: string) {
    return this.prisma.client.findFirst({
      where: { id: clientId, companyId, deletedAt: null },
    });
  }

  async findServiceOrder(serviceOrderId: string, companyId: string) {
    return this.prisma.serviceOrder.findFirst({
      where: { id: serviceOrderId, companyId, deletedAt: null },
    });
  }

  async findTechnician(technicianId: string, companyId: string) {
    return this.prisma.technician.findFirst({
      where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
    });
  }

  async findConflictingAppointment(companyId: string, technicianId: string, start: Date, end: Date, excludeId?: string) {
    // Utilize pessimistic locking where necessary in transactions, but for raw finding we can do this:
    const where: any = {
      companyId,
      technicianId,
      deletedAt: null,
      startTime: { lt: end },
      endTime: { gt: start },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    return this.prisma.appointment.findFirst({
      where,
      include: {
        technician: { select: { name: true } },
      },
    });
  }

  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return this.prisma.appointment.create({
      data,
      include: {
        client: true,
        technician: { select: { id: true, name: true } },
        serviceOrder: true,
      },
    });
  }

  async findMany(filters: AppointmentFilters) {
    const where: any = {
      companyId: filters.companyId,
      deletedAt: null,
    };

    if (filters.technicianId) where.technicianId = filters.technicianId;
    if (filters.clientId) where.clientId = filters.clientId;

    if (filters.startDate || filters.endDate) {
      where.AND = [];
      if (filters.startDate) where.AND.push({ endTime: { gte: new Date(filters.startDate) } });
      if (filters.endDate) where.AND.push({ startTime: { lte: new Date(filters.endDate) } });
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        client: { select: { id: true, name: true, phone: true, whatsapp: true } },
        technician: { select: { id: true, name: true } },
        serviceOrder: { select: { id: true, number: true, status: true } },
      },
    });
  }

  async findByIdAndCompany(id: string, companyId: string) {
    return this.prisma.appointment.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        client: true,
        technician: { select: { id: true, name: true } },
        serviceOrder: true,
      },
    });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        client: true,
        technician: { select: { id: true, name: true } },
        serviceOrder: true,
      },
    });
  }
}
