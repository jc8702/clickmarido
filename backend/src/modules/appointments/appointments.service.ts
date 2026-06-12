import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateAppointmentDto, companyId: string) {
    const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force } = createDto;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new BadRequestException('A data de início deve ser anterior à data de término.');
    }

    // 1. Validar cliente se informado
    if (clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, companyId, deletedAt: null },
      });
      if (!client) {
        throw new NotFoundException('Cliente não encontrado.');
      }
    }

    // 2. Validar ordem de serviço se informada
    if (serviceOrderId) {
      const os = await this.prisma.serviceOrder.findFirst({
        where: { id: serviceOrderId, companyId, deletedAt: null },
      });
      if (!os) {
        throw new NotFoundException('Ordem de serviço não encontrada.');
      }
    }

    // 3. Validar técnico e verificar conflitos de horários
    if (technicianId) {
      const tech = await this.prisma.technician.findFirst({
        where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
      });
      if (!tech) {
        throw new NotFoundException('Técnico não encontrado ou inativo.');
      }

      // Checar conflitos de horários
      if (!force) {
        const conflicting = await this.prisma.appointment.findFirst({
          where: {
            companyId,
            technicianId,
            deletedAt: null,
            startTime: { lt: end },
            endTime: { gt: start },
          },
          include: {
            technician: {
              select: { name: true },
            },
          },
        });

        if (conflicting) {
          return {
            success: false,
            conflict: true,
            message: `O técnico ${conflicting.technician?.name} possui um conflito com o compromisso "${conflicting.title}" neste período.`,
            data: conflicting,
          };
        }
      }
    }

    // 4. Criar o agendamento
    const appointment = await this.prisma.appointment.create({
      data: {
        companyId,
        title,
        description,
        startTime: start,
        endTime: end,
        clientId: clientId || null,
        technicianId: technicianId || null,
        serviceOrderId: serviceOrderId || null,
      },
      include: {
        client: true,
        technician: {
          select: {
            id: true,
            name: true,
          },
        },
        serviceOrder: true,
      },
    });

    return {
      success: true,
      data: appointment,
    };
  }

  async findAll(
    companyId: string,
    startDate?: string,
    endDate?: string,
    technicianId?: string,
    clientId?: string,
  ) {
    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (technicianId) {
      where.technicianId = technicianId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    // Filtragem por período
    if (startDate || endDate) {
      where.AND = [];
      if (startDate) {
        where.AND.push({
          endTime: { gte: new Date(startDate) },
        });
      }
      if (endDate) {
        where.AND.push({
          startTime: { lte: new Date(endDate) },
        });
      }
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsapp: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
          },
        },
        serviceOrder: {
          select: {
            id: true,
            number: true,
            status: true,
          },
        },
      },
    });

    return {
      success: true,
      data: appointments,
    };
  }

  async findOne(id: string, companyId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        client: true,
        technician: {
          select: {
            id: true,
            name: true,
          },
        },
        serviceOrder: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    return {
      success: true,
      data: appointment,
    };
  }

  async update(id: string, updateDto: UpdateAppointmentDto, companyId: string) {
    const existing = await this.prisma.appointment.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force } = updateDto;

    const start = startTime ? new Date(startTime) : existing.startTime;
    const end = endTime ? new Date(endTime) : existing.endTime;

    if (start >= end) {
      throw new BadRequestException('A data de início deve ser anterior à data de término.');
    }

    // Validar cliente se enviado
    if (clientId && clientId !== existing.clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, companyId, deletedAt: null },
      });
      if (!client) {
        throw new NotFoundException('Cliente não encontrado.');
      }
    }

    // Validar ordem de serviço se enviado
    if (serviceOrderId && serviceOrderId !== existing.serviceOrderId) {
      const os = await this.prisma.serviceOrder.findFirst({
        where: { id: serviceOrderId, companyId, deletedAt: null },
      });
      if (!os) {
        throw new NotFoundException('Ordem de serviço não encontrada.');
      }
    }

    // Validar técnico e conflitos
    if (technicianId) {
      if (technicianId !== existing.technicianId || startTime || endTime) {
        const tech = await this.prisma.technician.findFirst({
          where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
        });
        if (!tech) {
          throw new NotFoundException('Técnico não encontrado ou inativo.');
        }

        if (!force) {
          const conflicting = await this.prisma.appointment.findFirst({
            where: {
              companyId,
              technicianId,
              deletedAt: null,
              id: { not: id }, // Exclui o próprio agendamento sendo editado
              startTime: { lt: end },
              endTime: { gt: start },
            },
            include: {
              technician: {
                select: { name: true },
              },
            },
          });

          if (conflicting) {
            return {
              success: false,
              conflict: true,
              message: `O técnico ${conflicting.technician?.name} possui um conflito com o compromisso "${conflicting.title}" neste período.`,
              data: conflicting,
            };
          }
        }
      }
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        startTime: start,
        endTime: end,
        clientId: clientId !== undefined ? clientId : existing.clientId,
        technicianId: technicianId !== undefined ? technicianId : existing.technicianId,
        serviceOrderId: serviceOrderId !== undefined ? serviceOrderId : existing.serviceOrderId,
      },
      include: {
        client: true,
        technician: {
          select: {
            id: true,
            name: true,
          },
        },
        serviceOrder: true,
      },
    });

    return {
      success: true,
      data: updated,
    };
  }

  async remove(id: string, companyId: string) {
    const existing = await this.prisma.appointment.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    await this.prisma.appointment.update({
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
