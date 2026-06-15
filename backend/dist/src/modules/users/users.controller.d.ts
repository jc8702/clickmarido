import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    findAll(page?: string, limit?: string, search?: string, roleId?: string, active?: string): Promise<{
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
    getRoles(): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            description: string | null;
        }[];
    }>;
    findOne(id: string): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
