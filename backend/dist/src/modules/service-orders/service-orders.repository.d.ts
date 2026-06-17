import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ServiceOrdersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ServiceOrderCreateInput): Promise<{
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
    }>;
    findMany(companyId: string): Promise<({
        client: {
            name: string;
            id: string;
        };
    } & {
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
    })[]>;
    findById(id: string, companyId: string): Promise<({
        client: {
            name: string;
            id: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string | null;
            phone: string;
            whatsapp: string | null;
            email: string | null;
            address: string | null;
            cep: string | null;
            city: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
        };
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
    } & {
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
    }) | null>;
    update(id: string, data: Prisma.ServiceOrderUpdateInput): Promise<{
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
    }>;
}
