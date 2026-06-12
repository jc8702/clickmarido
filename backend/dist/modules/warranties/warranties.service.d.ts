import { PrismaService } from '../../core/prisma/prisma.service';
export declare class WarrantiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, data: any): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(companyId: string): Promise<({
        client: {
            name: string;
        };
        serviceOrder: {
            number: number;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    findOne(id: string, companyId: string): Promise<{
        client: {
            id: string;
            email: string | null;
            name: string;
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
        serviceOrder: {
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
            clientRating: number | null;
            clientReview: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    updateStatus(id: string, companyId: string, status: string): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: string, companyId: string): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
