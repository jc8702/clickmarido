import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
export declare class TechniciansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTechnicianDto: CreateTechnicianDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
    findAll(companyId: string): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        status: string;
        rating: number;
    }[]>;
    findOne(id: string): Promise<{
        appointments: {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        }[];
        serviceOrders: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            status: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
        }[];
    } & {
        id: string;
        name: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
    getRanking(companyId: string): Promise<({
        _count: {
            appointments: number;
            serviceOrders: number;
        };
    } & {
        id: string;
        name: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        status: string;
        rating: number;
    })[]>;
    update(id: string, updateTechnicianDto: UpdateTechnicianDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        status: string;
        rating: number;
    }>;
}
