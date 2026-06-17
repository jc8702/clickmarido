import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class QuotesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.QuoteCreateInput, servicesData: Prisma.QuoteServiceCreateManyInput[], tx?: Prisma.TransactionClient): Promise<({
        client: {
            name: string;
            id: string;
            createdAt: Date;
            companyId: string;
            email: string | null;
            deletedAt: Date | null;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            lat: number | null;
            lng: number | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
        services: ({
            service: {
                value: number;
                name: string;
                warranty: number;
                description: string | null;
                id: string;
                createdAt: Date;
                companyId: string;
                deletedAt: Date | null;
                updatedAt: Date;
                active: boolean;
                category: string;
                averageTime: number;
                complexity: string;
                specialty: string | null;
            };
        } & {
            value: number;
            id: string;
            quoteId: string;
            serviceId: string;
            quantity: number;
        })[];
    } & {
        number: number;
        status: string;
        id: string;
        createdAt: Date;
        companyId: string;
        deletedAt: Date | null;
        updatedAt: Date;
        materials: Prisma.JsonValue | null;
        clientId: string;
        discount: number;
        travelFee: number;
        totalValue: number;
        signature: string | null;
        signedAt: Date | null;
    }) | null>;
    findMaxQuoteNumber(companyId: string): Promise<{
        number: number;
        status: string;
        id: string;
        createdAt: Date;
        companyId: string;
        deletedAt: Date | null;
        updatedAt: Date;
        materials: Prisma.JsonValue | null;
        clientId: string;
        discount: number;
        travelFee: number;
        totalValue: number;
        signature: string | null;
        signedAt: Date | null;
    } | null>;
    findManyWithCount(where: Prisma.QuoteWhereInput, skip: number, take: number): Promise<[({
        client: {
            name: string;
            id: string;
            email: string | null;
            phone: string;
            whatsapp: string | null;
        };
        services: ({
            service: {
                name: string;
                category: string;
            };
        } & {
            value: number;
            id: string;
            quoteId: string;
            serviceId: string;
            quantity: number;
        })[];
    } & {
        number: number;
        status: string;
        id: string;
        createdAt: Date;
        companyId: string;
        deletedAt: Date | null;
        updatedAt: Date;
        materials: Prisma.JsonValue | null;
        clientId: string;
        discount: number;
        travelFee: number;
        totalValue: number;
        signature: string | null;
        signedAt: Date | null;
    })[], number]>;
    findById(id: string, companyId?: string, tx?: Prisma.TransactionClient): Promise<({
        company: {
            name: string;
            id: string;
            cnpj: string | null;
            phone: string | null;
        };
        client: {
            name: string;
            id: string;
            createdAt: Date;
            companyId: string;
            email: string | null;
            deletedAt: Date | null;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            lat: number | null;
            lng: number | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
        services: ({
            service: {
                value: number;
                name: string;
                warranty: number;
                description: string | null;
                id: string;
                createdAt: Date;
                companyId: string;
                deletedAt: Date | null;
                updatedAt: Date;
                active: boolean;
                category: string;
                averageTime: number;
                complexity: string;
                specialty: string | null;
            };
        } & {
            value: number;
            id: string;
            quoteId: string;
            serviceId: string;
            quantity: number;
        })[];
    } & {
        number: number;
        status: string;
        id: string;
        createdAt: Date;
        companyId: string;
        deletedAt: Date | null;
        updatedAt: Date;
        materials: Prisma.JsonValue | null;
        clientId: string;
        discount: number;
        travelFee: number;
        totalValue: number;
        signature: string | null;
        signedAt: Date | null;
    }) | null>;
    update(id: string, data: Prisma.QuoteUpdateInput, servicesData?: any[], tx?: Prisma.TransactionClient): Promise<({
        client: {
            name: string;
            id: string;
            createdAt: Date;
            companyId: string;
            email: string | null;
            deletedAt: Date | null;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            lat: number | null;
            lng: number | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
        services: ({
            service: {
                value: number;
                name: string;
                warranty: number;
                description: string | null;
                id: string;
                createdAt: Date;
                companyId: string;
                deletedAt: Date | null;
                updatedAt: Date;
                active: boolean;
                category: string;
                averageTime: number;
                complexity: string;
                specialty: string | null;
            };
        } & {
            value: number;
            id: string;
            quoteId: string;
            serviceId: string;
            quantity: number;
        })[];
    } & {
        number: number;
        status: string;
        id: string;
        createdAt: Date;
        companyId: string;
        deletedAt: Date | null;
        updatedAt: Date;
        materials: Prisma.JsonValue | null;
        clientId: string;
        discount: number;
        travelFee: number;
        totalValue: number;
        signature: string | null;
        signedAt: Date | null;
    }) | null>;
    executeTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
