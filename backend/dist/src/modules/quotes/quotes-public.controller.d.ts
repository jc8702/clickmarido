import { QuotesService } from './quotes.service';
export declare class QuotesPublicController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    findPublicQuote(id: string): Promise<{
        success: boolean;
        data: {
            company: {
                name: string;
                id: string;
                phone: string | null;
                cnpj: string | null;
            };
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
            services: ({
                service: {
                    name: string;
                    warranty: number;
                    id: string;
                    value: number;
                    category: string;
                    description: string | null;
                    averageTime: number;
                    complexity: string;
                    specialty: string | null;
                    active: boolean;
                    companyId: string;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                quoteId: string;
                serviceId: string;
                quantity: number;
                value: number;
            })[];
        } & {
            number: number;
            id: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            discount: number;
            travelFee: number;
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        };
    }>;
    savePublicSignature(id: string, signature: string): Promise<{
        success: boolean;
        data: {
            id: string | undefined;
            status: string | undefined;
        };
    }>;
}
