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
            slug: string;
            cnpj: string | null;
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            active: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, active?: string, state?: string): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                slug: string;
                cnpj: string | null;
                name: string;
                phone: string | null;
                email: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                active: boolean;
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
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            slug: string;
            cnpj: string | null;
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            active: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        success: boolean;
        data: {
            id: string;
            slug: string;
            cnpj: string | null;
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            active: boolean;
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
