import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class QuotesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.QuoteCreateInput, servicesData: Prisma.QuoteServiceCreateManyInput[], tx?: Prisma.TransactionClient): Promise<({
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
    }) | null>;
    findMaxQuoteNumber(companyId: string): Promise<{
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
    } | null>;
    findManyWithCount(where: Prisma.QuoteWhereInput, skip: number, take: number): Promise<[({
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
    })[], number]>;
    findById(id: string, companyId?: string, tx?: Prisma.TransactionClient): Promise<({
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
    }) | null>;
    update(id: string, data: Prisma.QuoteUpdateInput, servicesData?: Array<{
        serviceId: string;
        quantity: number;
        value: number;
    }>, tx?: Prisma.TransactionClient): Promise<({
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
    }) | null>;
    executeTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
