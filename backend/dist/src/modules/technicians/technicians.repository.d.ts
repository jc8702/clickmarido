import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TechniciansRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TechnicianCreateInput): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
    findMany(companyId: string): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }[]>;
    findById(id: string, companyId: string): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    } | null>;
    update(id: string, data: Prisma.TechnicianUpdateInput): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
    softDelete(id: string): Promise<{
        name: string;
        id: string;
        specialty: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        lat: number | null;
        lng: number | null;
        rating: number;
    }>;
}
