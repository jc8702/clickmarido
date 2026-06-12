import { QuotesService } from './quotes.service';
export declare class QuotesPublicController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    findPublicQuote(id: string): Promise<{
        success: boolean;
        data: {
            company: {
                id: string;
                name: string;
                cnpj: string | null;
                phone: string | null;
            };
            client: {
                email: string | null;
                name: string;
                cpf: string | null;
            };
            services: ({
                service: {
                    name: string;
                    description: string | null;
                };
            } & {
                id: string;
                value: number;
                serviceId: string;
                quantity: number;
                quoteId: string;
            })[];
        } & {
            number: number;
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            clientId: string;
            discount: number;
            travelFee: number;
            status: string;
            signature: string | null;
            totalValue: number;
            signedAt: Date | null;
        };
    }>;
    savePublicSignature(id: string, signature: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
        };
    }>;
}
