import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string | null;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            cnpj: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            active: boolean;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, active?: boolean, state?: string): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                email: string | null;
                name: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                cnpj: string | null;
                phone: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                active: boolean;
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
            id: string;
            email: string | null;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            cnpj: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            active: boolean;
        };
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string | null;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            cnpj: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            active: boolean;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
