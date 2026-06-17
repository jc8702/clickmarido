import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { PdfService } from '../../core/pdf/pdf.service';
import type { Response } from 'express';
export declare class QuotesController {
    private readonly quotesService;
    private readonly pdfService;
    constructor(quotesService: QuotesService, pdfService: PdfService);
    create(createQuoteDto: CreateQuoteDto): Promise<{
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
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        }) | null;
    }>;
    findAll(page?: string, limit?: string, search?: string, status?: string, clientId?: string): Promise<{
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
                materials: import("@prisma/client/runtime/client").JsonValue | null;
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
    findOne(id: string): Promise<{
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
    update(id: string, updateQuoteDto: UpdateQuoteDto): Promise<{
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
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        }) | null;
    }>;
    saveSignature(id: string, signature: string): Promise<{
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
            materials: import("@prisma/client/runtime/client").JsonValue | null;
            totalValue: number;
            status: string;
            signature: string | null;
            signedAt: Date | null;
        }) | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
    getPdf(id: string, res: Response): Promise<void>;
}
