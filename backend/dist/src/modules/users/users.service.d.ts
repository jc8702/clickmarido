import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, companyId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            email: string;
            isActive: boolean;
            companyId: string;
            createdAt: Date;
            roles: {
                name: string;
                id: string;
                description: string | null;
            }[];
        };
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, roleId?: string, active?: boolean): Promise<{
        success: boolean;
        data: {
            items: {
                name: string;
                id: string;
                email: string;
                isActive: boolean;
                companyId: string;
                createdAt: Date;
                roles: {
                    name: string;
                    id: string;
                    description: string | null;
                }[];
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            email: string;
            isActive: boolean;
            companyId: string;
            createdAt: Date;
            roles: {
                name: string;
                id: string;
                description: string | null;
            }[];
        };
    }>;
    update(id: string, updateUserDto: UpdateUserDto, companyId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            email: string;
            isActive: boolean;
            companyId: string;
            createdAt: Date;
            roles: {
                name: string;
                id: string;
                description: string | null;
            }[];
        };
    }>;
    remove(id: string, companyId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
    getRoles(companyId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            description: string | null;
        }[];
    }>;
}
