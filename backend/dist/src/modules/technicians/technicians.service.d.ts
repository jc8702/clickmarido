import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
export declare class TechniciansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTechnicianDto: CreateTechnicianDto): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
    findAll(companyId: string): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }[]>;
    findOne(id: string): Promise<{
        appointments: {
            id: string;
            description: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string | null;
            title: string;
            technicianId: string | null;
            serviceOrderId: string | null;
            startTime: Date;
            endTime: Date;
        }[];
        serviceOrders: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            quoteId: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            totalValue: number;
            status: string;
            signature: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        }[];
    } & {
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
    getRanking(companyId: string): Promise<({
        _count: {
            appointments: number;
            serviceOrders: number;
        };
    } & {
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    })[]>;
    update(id: string, updateTechnicianDto: UpdateTechnicianDto): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
}
