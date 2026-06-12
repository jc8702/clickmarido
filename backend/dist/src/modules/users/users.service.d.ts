import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            email: string;
            createdAt: Date;
            roles: {
                id: string;
                name: string;
                description: string | null;
            }[];
            companyId: string;
            isActive: boolean;
        };
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, roleId?: string, active?: boolean): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                name: string;
                email: string;
                createdAt: Date;
                roles: {
                    id: string;
                    name: string;
                    description: string | null;
                }[];
                companyId: string;
                isActive: boolean;
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
            id: string;
            name: string;
            email: string;
            createdAt: Date;
            roles: {
                id: string;
                name: string;
                description: string | null;
            }[];
            companyId: string;
            isActive: boolean;
        };
    }>;
    update(id: string, updateUserDto: UpdateUserDto, companyId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            email: string;
            createdAt: Date;
            roles: {
                id: string;
                name: string;
                description: string | null;
            }[];
            companyId: string;
            isActive: boolean;
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
            id: string;
            name: string;
            description: string | null;
        }[];
    }>;
}
