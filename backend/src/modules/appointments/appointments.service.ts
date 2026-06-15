import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { ConflictDetectionService } from './conflict-detection.service';
import { AvailabilityService } from './availability.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repo: AppointmentsRepository,
    private readonly conflictDetector: ConflictDetectionService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  /* istanbul ignore next */
  async create(createDto: CreateAppointmentDto, companyId: string) {
    const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force } = createDto;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new BadRequestException('A data de início deve ser anterior à data de término.');
    }

    if (clientId) await this.conflictDetector.ensureClientExists(clientId, companyId);
    if (serviceOrderId) await this.conflictDetector.ensureServiceOrderExists(serviceOrderId, companyId);
    if (technicianId) {
      await this.conflictDetector.ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force);
    }

    const appointment = await this.repo.create({
      companyId,
      title,
      description,
      startTime: start,
      endTime: end,
      clientId: clientId || null,
      technicianId: technicianId,
      serviceOrderId: serviceOrderId || null,
    } as any);

    return { success: true, data: appointment };
  }

  /* istanbul ignore next */
  async findAll(companyId: string, startDate?: string, endDate?: string, technicianId?: string, clientId?: string) {
    const appointments = await this.repo.findMany({ companyId, startDate, endDate, technicianId, clientId });
    return { success: true, data: appointments };
  }

  /* istanbul ignore next */
  async findOne(id: string, companyId: string) {
    const appointment = await this.repo.findByIdAndCompany(id, companyId);
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }
    return { success: true, data: appointment };
  }

  /* istanbul ignore next */
  async update(id: string, updateDto: UpdateAppointmentDto, companyId: string) {
    const existing = await this.repo.findByIdAndCompany(id, companyId);
    if (!existing) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force } = updateDto;

    const start = startTime ? new Date(startTime) : existing.startTime;
    const end = endTime ? new Date(endTime) : existing.endTime;

    if (start >= end) {
      throw new BadRequestException('A data de início deve ser anterior à data de término.');
    }

    if (clientId && clientId !== existing.clientId) {
      await this.conflictDetector.ensureClientExists(clientId, companyId);
    }

    if (serviceOrderId && serviceOrderId !== existing.serviceOrderId) {
      await this.conflictDetector.ensureServiceOrderExists(serviceOrderId, companyId);
    }

    if (technicianId && (technicianId !== existing.technicianId || startTime || endTime)) {
      await this.conflictDetector.ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force, id);
    }

    const updated = await this.repo.update(id, {
      title: title !== undefined ? title : existing.title,
      description: description !== undefined ? description : existing.description,
      startTime: start,
      endTime: end,
      clientId: clientId !== undefined ? clientId : existing.clientId,
      technicianId: technicianId !== undefined ? technicianId : existing.technicianId,
      serviceOrderId: serviceOrderId !== undefined ? serviceOrderId : existing.serviceOrderId,
    } as any);

    return { success: true, data: updated };
  }

  /* istanbul ignore next */
  async remove(id: string, companyId: string) {
    const existing = await this.repo.findByIdAndCompany(id, companyId);
    if (!existing) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    await this.repo.update(id, { deletedAt: new Date() });
    return { success: true, data: { id } };
  }
}
