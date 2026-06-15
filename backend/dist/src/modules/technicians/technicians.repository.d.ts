import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TechniciansRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TechnicianCreateInput): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }>;
    findMany(companyId: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }[]>;
    findById(id: string, companyId: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    } | null>;
    update(id: string, data: Prisma.TechnicianUpdateInput): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }>;
    softDelete(id: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        status: string;
        lat: number | null;
        lng: number | null;
        specialty: string | null;
        rating: number;
    }>;
}
