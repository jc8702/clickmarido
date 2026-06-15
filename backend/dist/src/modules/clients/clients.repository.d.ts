import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export interface ClientFilters {
    companyId: string;
    skip?: number;
    take?: number;
    search?: string;
    leadSource?: string;
    city?: string;
}
export declare class ClientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByCpfAndCompany(cpf: string, companyId: string): Promise<{
        name: string;
        id: string;
        email: string | null;
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
    } | null>;
    findByIdAndCompany(id: string, companyId: string): Promise<{
        name: string;
        id: string;
        email: string | null;
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
    } | null>;
    findUserById(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        isActive: boolean;
        deletedAt: Date | null;
        companyId: string;
        resetToken: string | null;
        resetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    private buildWhereClause;
    findManyWithCount(filters: ClientFilters): Promise<[{
        name: string;
        id: string;
        email: string | null;
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
    }[], number]>;
    createWithHistory(clientData: Prisma.ClientUncheckedCreateInput, historyData: Prisma.ClientHistoryUncheckedCreateInput): Promise<{
        name: string;
        id: string;
        email: string | null;
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
    }>;
    updateWithHistory(clientId: string, dataToUpdate: Prisma.ClientUpdateInput, historyData: Prisma.ClientHistoryUncheckedCreateInput): Promise<{
        name: string;
        id: string;
        email: string | null;
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
    }>;
    softDeleteWithHistory(clientId: string, historyData: Prisma.ClientHistoryUncheckedCreateInput): Promise<void>;
    findHistory(clientId: string): Promise<({
        createdBy: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        description: string;
        type: string;
        clientId: string;
        createdById: string | null;
    })[]>;
    createHistory(data: Prisma.ClientHistoryUncheckedCreateInput): Promise<{
        createdBy: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        description: string;
        type: string;
        clientId: string;
        createdById: string | null;
    }>;
}
