import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ServiceOrdersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ServiceOrderCreateInput): Promise<{
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
    })[]>;
    findById(id: string, companyId: string): Promise<({
        client: {
            name: string;
            id: string;
            email: string | null;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
        };
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
    } & {
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
    }) | null>;
    update(id: string, data: Prisma.ServiceOrderUpdateInput): Promise<{
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
    }>;
}
