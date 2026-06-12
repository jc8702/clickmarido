import { WarrantiesService } from './warranties.service';
export declare class WarrantiesController {
    private readonly warrantiesService;
    constructor(warrantiesService: WarrantiesService);
    create(body: any): Promise<{
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
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
    updateStatus(id: string, status: string): Promise<{
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
    remove(id: string): Promise<{
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
