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
    } | null>;
    findByIdAndCompany(id: string, companyId: string): Promise<{
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
    } | null>;
    findUserById(userId: string): Promise<{
        name: string;
        id: string;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        isActive: boolean;
        resetToken: string | null;
        resetExpires: Date | null;
    } | null>;
    private buildWhereClause;
    findManyWithCount(filters: ClientFilters): Promise<[{
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
    }[], number]>;
    createWithHistory(clientData: Prisma.ClientUncheckedCreateInput, historyData: Prisma.ClientHistoryUncheckedCreateInput): Promise<{
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
    }>;
    updateWithHistory(clientId: string, dataToUpdate: Prisma.ClientUpdateInput, historyData: Prisma.ClientHistoryUncheckedCreateInput): Promise<{
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
        description: string;
        createdAt: Date;
        clientId: string;
        type: string;
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
        description: string;
        createdAt: Date;
        clientId: string;
        type: string;
        createdById: string | null;
    }>;
}
