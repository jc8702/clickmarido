import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
export declare class ServiceOrdersController {
    private readonly osService;
    constructor(osService: ServiceOrdersService);
    create(dto: CreateServiceOrderDto): Promise<{
        materials: {
            id: string;
            description: string;
            quantity: number;
            serviceOrderId: string;
            materialId: string | null;
            unitValue: number;
        }[];
        services: {
            id: string;
            name: string;
            value: number;
            quantity: number;
            serviceOrderId: string;
        }[];
    } & {
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    }>;
    generateFromQuote(quoteId: string): Promise<{
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    }>;
    findAll(companyId: string): Promise<({
        client: {
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
        technician: {
            id: string;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            lat: number | null;
            lng: number | null;
            specialty: string | null;
            status: string;
            rating: number;
        } | null;
    } & {
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    })[]>;
    findOne(id: string): Promise<{
        client: {
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
        technician: {
            id: string;
            name: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            lat: number | null;
            lng: number | null;
            specialty: string | null;
            status: string;
            rating: number;
        } | null;
        materials: {
            id: string;
            description: string;
            quantity: number;
            serviceOrderId: string;
            materialId: string | null;
            unitValue: number;
        }[];
        services: {
            id: string;
            name: string;
            value: number;
            quantity: number;
            serviceOrderId: string;
        }[];
        checklists: {
            id: string;
            serviceOrderId: string;
            item: string;
            checked: boolean;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            type: string;
            serviceOrderId: string;
            url: string;
        }[];
    } & {
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    }>;
    update(id: string, dto: UpdateServiceOrderDto): Promise<{
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    }>;
    finishOrder(id: string, signature: string): Promise<{
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        number: number;
        id: string;
        scheduledAt: Date | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        status: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
    }>;
    addPhoto(id: string, url: string, type: 'antes' | 'depois'): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        serviceOrderId: string;
        url: string;
    }>;
    addChecklistItem(id: string, item: string): Promise<{
        id: string;
        serviceOrderId: string;
        item: string;
        checked: boolean;
    }>;
    toggleChecklist(id: string, checklistId: string, checked: boolean): Promise<{
        id: string;
        serviceOrderId: string;
        item: string;
        checked: boolean;
    }>;
}
