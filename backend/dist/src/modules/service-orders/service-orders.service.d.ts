import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
export declare class ServiceOrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceOrderDto): Promise<{
        services: {
            id: string;
            name: string;
            value: number;
            quantity: number;
            serviceOrderId: string;
        }[];
        materials: {
            id: string;
            description: string;
            quantity: number;
            serviceOrderId: string;
            materialId: string | null;
            unitValue: number;
        }[];
    } & {
        number: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        scheduledAt: Date | null;
        observations: string | null;
    }>;
    findAll(companyId: string): Promise<({
        client: {
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
        technician: {
            id: string;
            name: string;
            phone: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            specialty: string | null;
            status: string;
            rating: number;
        } | null;
    } & {
        number: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        scheduledAt: Date | null;
        observations: string | null;
    })[]>;
    findOne(id: string): Promise<{
        services: {
            id: string;
            name: string;
            value: number;
            quantity: number;
            serviceOrderId: string;
        }[];
        materials: {
            id: string;
            description: string;
            quantity: number;
            serviceOrderId: string;
            materialId: string | null;
            unitValue: number;
        }[];
        client: {
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
        technician: {
            id: string;
            name: string;
            phone: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            specialty: string | null;
            status: string;
            rating: number;
        } | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            type: string;
            serviceOrderId: string;
        }[];
        checklists: {
            id: string;
            serviceOrderId: string;
            item: string;
            checked: boolean;
        }[];
    } & {
        number: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        scheduledAt: Date | null;
        observations: string | null;
    }>;
    generateFromQuote(quoteId: string): Promise<{
        number: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        scheduledAt: Date | null;
        observations: string | null;
    }>;
    update(id: string, dto: UpdateServiceOrderDto): Promise<{
        number: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        scheduledAt: Date | null;
        observations: string | null;
    }>;
    finishOrder(id: string, signatureBase64: string): Promise<{
        number: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        scheduledAt: Date | null;
        observations: string | null;
    }>;
    addPhoto(id: string, url: string, type: 'antes' | 'depois'): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: string;
        serviceOrderId: string;
    }>;
    toggleChecklist(id: string, checklistId: string, checked: boolean): Promise<{
        id: string;
        serviceOrderId: string;
        item: string;
        checked: boolean;
    }>;
    addChecklistItem(id: string, item: string): Promise<{
        id: string;
        serviceOrderId: string;
        item: string;
        checked: boolean;
    }>;
}
