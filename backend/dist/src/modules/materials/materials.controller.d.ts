import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    create(createMaterialDto: CreateMaterialDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            quantity: number;
            minimumStock: number;
            averageCost: number;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, category?: string, lowStock?: string): Promise<{
        success: boolean;
        data: {
            items: {
                name: string;
                id: string;
                deletedAt: Date | null;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                quantity: number;
                minimumStock: number;
                averageCost: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            quantity: number;
            minimumStock: number;
            averageCost: number;
        };
    }>;
    findMovements(id: string, page?: string, limit?: string): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: string;
                createdById: string | null;
                quantity: number;
                materialId: string;
                unitCost: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createMovement(id: string, dto: CreateMaterialMovementDto): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            type: string;
            createdById: string | null;
            quantity: number;
            materialId: string;
            unitCost: number;
        };
    }>;
    update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            quantity: number;
            minimumStock: number;
            averageCost: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
