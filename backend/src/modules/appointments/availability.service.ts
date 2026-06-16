import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';

@Injectable()
export class AvailabilityService {
  constructor(private readonly repo: AppointmentsRepository) {}

  // Lógica futura para checar disponibilidade baseada em grade de horários
  getAvailableSlots(_technicianId: string, _date: Date): Promise<unknown[]> {
    // Implementação de disponibilidade
    return Promise.resolve([]);
  }
}
