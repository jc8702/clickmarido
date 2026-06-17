import type { Response } from 'express';
import { ServicesService, ImportServiceItem } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto): Promise<{
        success: boolean;
        data: {
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
    }>;
    findAll(page?: string, limit?: string, search?: string, category?: string, complexity?: string, active?: string): Promise<{
        success: boolean;
        data: {
            items: {
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
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    exportCsv(res: Response): Promise<Response<any, Record<string, any>>>;
    validateCsv(csvContent: string): Promise<{
        success: boolean;
        data: {
            index: number;
            isValid: boolean;
            action: "CREATE" | "UPDATE" | "NONE";
            errors: string[];
            service: {
                category: string;
                name: string;
                description: string | null;
                value: number;
                averageTime: number;
                complexity: string;
                warranty: number;
                specialty: string | null;
                active: boolean;
            };
        }[];
    }>;
    confirmImport(items: ImportServiceItem[]): Promise<{
        success: boolean;
        data: {
            totalProcessed: number;
            createdCount: number;
            updatedCount: number;
            errorCount: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
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
    }>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<{
        success: boolean;
        data: {
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
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
