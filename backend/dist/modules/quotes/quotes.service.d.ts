import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createQuoteDto: CreateQuoteDto, companyId: string): Promise<{
        success: boolean;
        data: ({
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
            services: ({
                service: {
                    warranty: number;
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    companyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    active: boolean;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    specialty: string | null;
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
        }) | null;
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, status?: string, clientId?: string): Promise<{
        success: boolean;
        data: {
            items: ({
                client: {
                    id: string;
                    email: string | null;
                    name: string;
                    phone: string;
                    whatsapp: string | null;
                };
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
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
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
            services: ({
                service: {
                    warranty: number;
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    companyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    active: boolean;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    specialty: string | null;
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
    update(id: string, updateQuoteDto: UpdateQuoteDto, companyId: string): Promise<{
        success: boolean;
        data: ({
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
            services: ({
                service: {
                    warranty: number;
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    companyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    active: boolean;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    specialty: string | null;
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
        }) | null;
    }>;
    saveSignature(id: string, signatureBase64: string, companyId: string): Promise<{
        success: boolean;
        data: {
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
            services: ({
                service: {
                    warranty: number;
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    companyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    active: boolean;
                    category: string;
                    value: number;
                    averageTime: number;
                    complexity: string;
                    specialty: string | null;
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
    remove(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
