import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';

@Injectable()
export class AvailabilityService {
  constructor(private readonly repo: AppointmentsRepository) {}

  // Lógica futura para checar disponibilidade baseada em grade de horários
  async getAvailableSlots(technicianId: string, date: Date) {
    // Implementação de disponibilidade
    return [];
  }
}
