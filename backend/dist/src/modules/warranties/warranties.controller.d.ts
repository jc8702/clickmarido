import { WarrantiesService } from './warranties.service';
import type { CreateWarrantyInput } from './warranties.service';
export declare class WarrantiesController {
    private readonly warrantiesService;
    constructor(warrantiesService: WarrantiesService);
    create(body: CreateWarrantyInput): Promise<{
        id: string;
        description: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        type: string;
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
        description: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        type: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    findOne(id: string): Promise<{
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
        serviceOrder: {
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
        };
    } & {
        id: string;
        description: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        type: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        description: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        type: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        type: string;
        serviceOrderId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
