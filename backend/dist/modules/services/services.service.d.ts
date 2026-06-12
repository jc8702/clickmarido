import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createServiceDto: CreateServiceDto, companyId: string): Promise<{
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
    findAll(companyId: string, page?: number, limit?: number, search?: string, category?: string, complexity?: string, active?: boolean): Promise<{
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
    findOne(id: string, companyId: string): Promise<{
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
    update(id: string, updateServiceDto: UpdateServiceDto, companyId: string): Promise<{
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
    confirmImport(items: any[], companyId: string): Promise<{
        success: boolean;
        data: {
            totalProcessed: number;
            createdCount: number;
            updatedCount: number;
            errorCount: number;
        };
    }>;
}
