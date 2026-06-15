import { AppointmentsRepository } from './appointments.repository';
export declare class ConflictDetectionService {
    private readonly repo;
    constructor(repo: AppointmentsRepository);
    ensureClientExists(clientId: string, companyId: string): Promise<void>;
    ensureServiceOrderExists(serviceOrderId: string, companyId: string): Promise<void>;
    ensureTechnicianAndCheckConflicts(companyId: string, technicianId: string, start: Date, end: Date, force?: boolean, excludeAppointmentId?: string): Promise<void>;
}
