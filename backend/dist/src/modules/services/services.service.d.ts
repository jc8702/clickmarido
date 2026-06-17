import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export interface ImportServiceItem {
    action: string;
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
}
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createServiceDto: CreateServiceDto, companyId: string): Promise<{
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
    findAll(companyId: string, page?: number, limit?: number, search?: string, category?: string, complexity?: string, active?: boolean): Promise<{
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
    findOne(id: string, companyId: string): Promise<{
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
    update(id: string, updateServiceDto: UpdateServiceDto, companyId: string): Promise<{
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
    remove(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
    exportCsv(companyId: string): Promise<string>;
    validateCsv(csvContent: string, companyId: string): Promise<{
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
    confirmImport(items: ImportServiceItem[], companyId: string): Promise<{
        success: boolean;
        data: {
            totalProcessed: number;
            createdCount: number;
            updatedCount: number;
            errorCount: number;
        };
    }>;
}
