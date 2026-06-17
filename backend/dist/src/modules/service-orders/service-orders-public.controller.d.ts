import { ServiceOrdersService } from './service-orders.service';
export declare class ServiceOrdersPublicController {
    private readonly serviceOrdersService;
    constructor(serviceOrdersService: ServiceOrdersService);
    findPublicOrder(id: string): Promise<{
        company: {
            name: string;
            phone: string | null;
        };
        technician: {
            name: string;
            phone: string;
        } | null;
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
    }>;
    saveClientRating(id: string, rating: number, review?: string): Promise<{
        success: boolean;
    }>;
}
