import { AppointmentsRepository } from './appointments.repository';
export declare class AvailabilityService {
    private readonly repo;
    constructor(repo: AppointmentsRepository);
    getAvailableSlots(_technicianId: string, _date: Date): Promise<unknown[]>;
}
