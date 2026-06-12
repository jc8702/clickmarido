import type { Response } from 'express';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto): Promise<{
        success: boolean;
        data: {
            warranty: number;
            id: string;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            active: boolean;
            category: string;
            value: number;
            averageTime: number;
            complexity: string;
            specialty: string | null;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, category?: string, complexity?: string, active?: string): Promise<{
        success: boolean;
        data: {
            items: {
                warranty: number;
                id: string;
                name: string;
                deletedAt: Date | null;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                active: boolean;
                category: string;
                value: number;
                averageTime: number;
                complexity: string;
                specialty: string | null;
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
    confirmImport(items: any[]): Promise<{
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
            warranty: number;
            id: string;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            active: boolean;
            category: string;
            value: number;
            averageTime: number;
            complexity: string;
            specialty: string | null;
        };
    }>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<{
        success: boolean;
        data: {
            warranty: number;
            id: string;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            active: boolean;
            category: string;
            value: number;
            averageTime: number;
            complexity: string;
            specialty: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
