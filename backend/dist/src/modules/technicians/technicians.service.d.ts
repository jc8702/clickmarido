import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
export declare class TechniciansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTechnicianDto: CreateTechnicianDto): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }>;
    findAll(companyId: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
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
            title: string;
            clientId: string | null;
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
            status: string;
            clientId: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        }[];
    } & {
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
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
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    })[]>;
    update(id: string, updateTechnicianDto: UpdateTechnicianDto): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }>;
}
