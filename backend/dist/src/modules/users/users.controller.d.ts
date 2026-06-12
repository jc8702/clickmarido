import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    findAll(page?: string, limit?: string, search?: string, roleId?: string, active?: string): Promise<{
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
    getRoles(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            description: string | null;
        }[];
    }>;
    findOne(id: string): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
