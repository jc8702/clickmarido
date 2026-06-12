import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
export declare class TechniciansController {
    private readonly techniciansService;
    constructor(techniciansService: TechniciansService);
    create(createTechnicianDto: CreateTechnicianDto): Promise<{
        id: string;
        name: string;
        phone: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
    findAll(companyId: string): Promise<{
        id: string;
        name: string;
        phone: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        specialty: string | null;
        status: string;
        rating: number;
    }[]>;
    getRanking(companyId: string): Promise<({
        _count: {
            serviceOrders: number;
            appointments: number;
        };
    } & {
        id: string;
        name: string;
        phone: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        specialty: string | null;
        status: string;
        rating: number;
    })[]>;
    findOne(id: string): Promise<{
        serviceOrders: {
            number: number;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            clientId: string;
            status: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            scheduledAt: Date | null;
            observations: string | null;
        }[];
        appointments: {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        phone: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
    update(id: string, updateTechnicianDto: UpdateTechnicianDto): Promise<{
        id: string;
        name: string;
        phone: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        phone: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
}
