import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesRepository } from './quotes.repository';
export declare class QuotesService {
    private readonly prisma;
    private readonly quotesRepository;
    constructor(prisma: PrismaService, quotesRepository: QuotesRepository);
    create(createQuoteDto: CreateQuoteDto, companyId: string): Promise<{
        success: boolean;
        data: ({
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
            materials: Prisma.JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        }) | null;
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, status?: string, clientId?: string): Promise<{
        success: boolean;
        data: {
            items: ({
                client: {
                    name: string;
                    id: string;
                    phone: string;
                    whatsapp: string | null;
                    email: string | null;
                };
                services: ({
                    service: {
                        name: string;
                        category: string;
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
                materials: Prisma.JsonValue | null;
                totalValue: number;
                status: string;
                signature: string | null;
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
            materials: Prisma.JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        };
    }>;
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
            materials: Prisma.JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        };
    }>;
    update(id: string, updateQuoteDto: UpdateQuoteDto, companyId: string): Promise<{
        success: boolean;
        data: ({
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
            materials: Prisma.JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        }) | null;
    }>;
    saveSignature(id: string, signatureBase64: string, companyId: string): Promise<{
        success: boolean;
        data: ({
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
            materials: Prisma.JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        }) | null;
    }>;
    savePublicSignature(id: string, signatureBase64: string): Promise<{
        success: boolean;
        data: {
            id: string | undefined;
            status: string | undefined;
        };
    }>;
    remove(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
