import { ClientsRepository } from './clients.repository';
import { ClientValidationService } from './client-validation.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
export declare class ClientsService {
    private readonly repo;
    private readonly validator;
    private readonly geolocationService;
    private readonly logger;
    constructor(repo: ClientsRepository, validator: ClientValidationService, geolocationService: GeolocationService);
    create(createClientDto: CreateClientDto, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string | null;
            phone: string;
            whatsapp: string | null;
            email: string | null;
            address: string | null;
            cep: string | null;
            city: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
        };
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, leadSource?: string, city?: string): Promise<{
        success: boolean;
        data: {
            items: {
                name: string;
                id: string;
                companyId: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                cpf: string | null;
                phone: string;
                whatsapp: string | null;
                email: string | null;
                address: string | null;
                cep: string | null;
                city: string | null;
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
    findOne(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string | null;
            phone: string;
            whatsapp: string | null;
            email: string | null;
            address: string | null;
            cep: string | null;
            city: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
        };
    }>;
    update(id: string, updateClientDto: UpdateClientDto, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string | null;
            phone: string;
            whatsapp: string | null;
            email: string | null;
            address: string | null;
            cep: string | null;
            city: string | null;
            leadSource: string | null;
            notes: string | null;
            lat: number | null;
            lng: number | null;
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
                name: string;
                id: string;
                email: string;
            } | null;
        } & {
            id: string;
            description: string;
            createdAt: Date;
            clientId: string;
            type: string;
            createdById: string | null;
        })[];
    }>;
    createHistory(clientId: string, createHistoryDto: CreateHistoryDto, companyId: string, userId?: string): Promise<{
        success: boolean;
        data: {
            createdBy: {
                name: string;
                id: string;
                email: string;
            } | null;
        } & {
            id: string;
            description: string;
            createdAt: Date;
            clientId: string;
            type: string;
            createdById: string | null;
        };
    }>;
    private getUserName;
}
