import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
export declare class QuotesController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    create(createQuoteDto: CreateQuoteDto): Promise<{
        success: boolean;
        data: ({
            services: ({
                service: {
                    id: string;
                    name: string;
                    active: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    companyId: string;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    warranty: number;
                    specialty: string | null;
                };
            } & {
                id: string;
                value: number;
                serviceId: string;
                quantity: number;
                quoteId: string;
            })[];
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
        } & {
            number: number;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            companyId: string;
            clientId: string;
            discount: number;
            travelFee: number;
            status: string;
            signature: string | null;
            totalValue: number;
            signedAt: Date | null;
        }) | null;
    }>;
    findAll(page?: string, limit?: string, search?: string, status?: string, clientId?: string): Promise<{
        success: boolean;
        data: {
            items: ({
                services: ({
                    service: {
                        name: string;
                        category: string;
                    };
                } & {
                    id: string;
                    value: number;
                    serviceId: string;
                    quantity: number;
                    quoteId: string;
                })[];
                client: {
                    id: string;
                    name: string;
                    phone: string;
                    email: string | null;
                    whatsapp: string | null;
                };
            } & {
                number: number;
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                materials: import("@prisma/client/runtime/client").JsonValue | null;
                companyId: string;
                clientId: string;
                discount: number;
                travelFee: number;
                status: string;
                signature: string | null;
                totalValue: number;
                signedAt: Date | null;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            services: ({
                service: {
                    id: string;
                    name: string;
                    active: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    companyId: string;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    warranty: number;
                    specialty: string | null;
                };
            } & {
                id: string;
                value: number;
                serviceId: string;
                quantity: number;
                quoteId: string;
            })[];
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
        } & {
            number: number;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            companyId: string;
            clientId: string;
            discount: number;
            travelFee: number;
            status: string;
            signature: string | null;
            totalValue: number;
            signedAt: Date | null;
        };
    }>;
    update(id: string, updateQuoteDto: UpdateQuoteDto): Promise<{
        success: boolean;
        data: ({
            services: ({
                service: {
                    id: string;
                    name: string;
                    active: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    companyId: string;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    warranty: number;
                    specialty: string | null;
                };
            } & {
                id: string;
                value: number;
                serviceId: string;
                quantity: number;
                quoteId: string;
            })[];
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
        } & {
            number: number;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            companyId: string;
            clientId: string;
            discount: number;
            travelFee: number;
            status: string;
            signature: string | null;
            totalValue: number;
            signedAt: Date | null;
        }) | null;
    }>;
    saveSignature(id: string, signature: string): Promise<{
        success: boolean;
        data: {
            services: ({
                service: {
                    id: string;
                    name: string;
                    active: boolean;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    companyId: string;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    warranty: number;
                    specialty: string | null;
                };
            } & {
                id: string;
                value: number;
                serviceId: string;
                quantity: number;
                quoteId: string;
            })[];
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
        } & {
            number: number;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            companyId: string;
            clientId: string;
            discount: number;
            travelFee: number;
            status: string;
            signature: string | null;
            totalValue: number;
            signedAt: Date | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
