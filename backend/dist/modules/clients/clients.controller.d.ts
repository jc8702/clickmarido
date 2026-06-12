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
            email: string | null;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, leadSource?: string, city?: string): Promise<{
        success: boolean;
        data: {
            items: {
                id: string;
                email: string | null;
                name: string;
                deletedAt: Date | null;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string;
                address: string | null;
                city: string | null;
                cpf: string | null;
                whatsapp: string | null;
                cep: string | null;
                leadSource: string | null;
                notes: string | null;
                lat: number | null;
                lng: number | null;
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
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
        };
    }>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string | null;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            address: string | null;
            city: string | null;
            cpf: string | null;
            whatsapp: string | null;
            cep: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
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
                email: string;
                name: string;
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
                email: string;
                name: string;
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
