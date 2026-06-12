import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
export declare class ClientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createClientDto: CreateClientDto, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
            city: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, leadSource?: string, city?: string): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                name: string;
                phone: string;
                email: string | null;
                address: string | null;
                city: string | null;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                cpf: string | null;
                whatsapp: string | null;
                cep: string | null;
                leadSource: string | null;
                notes: string | null;
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
            id: string;
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
            city: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
    }>;
    update(id: string, updateClientDto: UpdateClientDto, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
            city: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
        };
    }>;
    remove(id: string, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
    findHistory(clientId: string, companyId: string): Promise<{
        success: boolean;
        data: ({
            createdBy: {
                id: string;
                name: string;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            description: string;
            type: string;
            clientId: string;
            createdById: string | null;
        })[];
    }>;
    createHistory(clientId: string, createHistoryDto: CreateHistoryDto, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            createdBy: {
                id: string;
                name: string;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            description: string;
            type: string;
            clientId: string;
            createdById: string | null;
        };
    }>;
}
