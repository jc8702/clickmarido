import { PrismaService } from '../../core/prisma/prisma.service';
export declare class WarrantiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
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
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
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
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
            city: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
        serviceOrder: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    updateStatus(id: string, companyId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: string, companyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        type: string;
        clientId: string;
        status: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
