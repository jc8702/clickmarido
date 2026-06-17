import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            active: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            slug: string;
            cnpj: string | null;
            state: string | null;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, active?: boolean, state?: string): Promise<{
        success: boolean;
        data: {
            items: {
                name: string;
                id: string;
                active: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                email: string | null;
                address: string | null;
                city: string | null;
                slug: string;
                cnpj: string | null;
                state: string | null;
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
            active: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            slug: string;
            cnpj: string | null;
            state: string | null;
        };
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            active: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            slug: string;
            cnpj: string | null;
            state: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
