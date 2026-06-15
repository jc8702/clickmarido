import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';

@Injectable()
export class ConflictDetectionService {
  constructor(private readonly repo: AppointmentsRepository) {}

  async ensureClientExists(clientId: string, companyId: string) {
    const client = await this.repo.findClient(clientId, companyId);
    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }
  }

  async ensureServiceOrderExists(serviceOrderId: string, companyId: string) {
    const os = await this.repo.findServiceOrder(serviceOrderId, companyId);
    if (!os) {
      throw new NotFoundException('Ordem de serviço não encontrada.');
    }
  }

  async ensureTechnicianAndCheckConflicts(
    companyId: string,
    technicianId: string,
    start: Date,
    end: Date,
    force?: boolean,
    excludeAppointmentId?: string,
  ) {
    const tech = await this.repo.findTechnician(technicianId, companyId);
    if (!tech) {
      throw new NotFoundException('Técnico não encontrado ou inativo.');
    }

    if (!force) {
      const conflicting = await this.repo.findConflictingAppointment(
        companyId,
        technicianId,
        start,
        end,
        excludeAppointmentId,
      );

      if (conflicting) {
        throw new ConflictException(`O técnico ${conflicting.technician?.name} possui um conflito com o compromisso "${conflicting.title}" neste período.`);
      }
    }
  }
}
