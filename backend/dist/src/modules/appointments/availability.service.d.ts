import { AppointmentsRepository } from './appointments.repository';
export declare class AvailabilityService {
    private readonly repo;
    constructor(repo: AppointmentsRepository);
    getAvailableSlots(technicianId: string, date: Date): Promise<never[]>;
}
