import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
export declare class ClientsService {
    private readonly prisma;
    private readonly geolocationService;
    constructor(prisma: PrismaService, geolocationService: GeolocationService);
    create(createClientDto: CreateClientDto, companyId: string, userId?: string): Promise<{
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
    findAll(companyId: string, page?: number, limit?: number, search?: string, leadSource?: string, city?: string): Promise<{
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
    findOne(id: string, companyId: string): Promise<{
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
    update(id: string, updateClientDto: UpdateClientDto, companyId: string, userId?: string): Promise<{
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
    createHistory(clientId: string, createHistoryDto: CreateHistoryDto, companyId: string, userId?: string): Promise<{
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
