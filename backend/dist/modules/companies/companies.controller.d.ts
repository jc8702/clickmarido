import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
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
    findAll(page?: string, limit?: string, search?: string, active?: string, state?: string): Promise<{
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
