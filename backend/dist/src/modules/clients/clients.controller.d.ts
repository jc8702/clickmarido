import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): Promise<{
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
    findAll(page?: string, limit?: string, search?: string, leadSource?: string, city?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updateClientDto: UpdateClientDto): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
    findHistory(id: string): Promise<{
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
    createHistory(id: string, createHistoryDto: CreateHistoryDto): Promise<{
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
