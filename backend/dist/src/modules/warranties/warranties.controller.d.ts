import { WarrantiesService } from './warranties.service';
export declare class WarrantiesController {
    private readonly warrantiesService;
    constructor(warrantiesService: WarrantiesService);
    create(body: any): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        clientId: string;
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        clientId: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    findOne(id: string): Promise<{
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
        serviceOrder: {
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
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        clientId: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        clientId: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        clientId: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
