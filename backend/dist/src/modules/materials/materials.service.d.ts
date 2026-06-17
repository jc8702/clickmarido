import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto';
export declare class MaterialsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createMaterialDto: CreateMaterialDto, companyId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            quantity: number;
            category: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            minimumStock: number;
            averageCost: number;
        };
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, category?: string, lowStock?: boolean): Promise<{
        success: boolean;
        data: {
            items: {
                name: string;
                id: string;
                quantity: number;
                category: string;
                companyId: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                minimumStock: number;
                averageCost: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            quantity: number;
            category: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            minimumStock: number;
            averageCost: number;
        };
    }>;
    findMovements(id: string, companyId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                quantity: number;
                description: string | null;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                createdById: string | null;
                materialId: string;
                unitCost: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createMovement(materialId: string, companyId: string, userId: string | null, dto: CreateMaterialMovementDto): Promise<{
        success: boolean;
        data: {
            id: string;
            quantity: number;
            description: string | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            createdById: string | null;
            materialId: string;
            unitCost: number;
        };
    }>;
    update(id: string, updateMaterialDto: UpdateMaterialDto, companyId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            quantity: number;
            category: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            minimumStock: number;
            averageCost: number;
        };
    }>;
    remove(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
