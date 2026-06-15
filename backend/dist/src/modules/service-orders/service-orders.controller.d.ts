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
            name: string;
            id: string;
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
        status: string;
        clientId: string;
        signature: string | null;
        totalValue: number;
        quoteId: string | null;
        technicianId: string | null;
        observations: string | null;
        clientRating: number | null;
        clientReview: string | null;
    }>;
    generateFromQuote(quoteId: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            clientId: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, status?: string): Promise<{
        success: boolean;
        data: {
            items: ({
                client: {
                    name: string;
                    id: string;
                    email: string | null;
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
                    name: string;
                    id: string;
                    deletedAt: Date | null;
                    companyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    phone: string;
                    status: string;
                    lat: number | null;
                    lng: number | null;
                    specialty: string | null;
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
                    name: string;
                    id: string;
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
                status: string;
                clientId: string;
                signature: string | null;
                totalValue: number;
                quoteId: string | null;
                technicianId: string | null;
                observations: string | null;
                clientRating: number | null;
                clientReview: string | null;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            client: {
                name: string;
                id: string;
                email: string | null;
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
                name: string;
                id: string;
                deletedAt: Date | null;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string;
                status: string;
                lat: number | null;
                lng: number | null;
                specialty: string | null;
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
                name: string;
                id: string;
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
            status: string;
            clientId: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    update(id: string, dto: UpdateServiceOrderDto): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            clientId: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    finishOrder(id: string, signature: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            clientId: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    updateStatus(id: string, status: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            clientId: string;
            signature: string | null;
            totalValue: number;
            quoteId: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    addPhoto(id: string, url: string, type: 'antes' | 'depois'): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            type: string;
            serviceOrderId: string;
            url: string;
        };
    }>;
    addChecklistItem(id: string, item: string): Promise<{
        success: boolean;
        data: {
            id: string;
            serviceOrderId: string;
            item: string;
            checked: boolean;
        };
    }>;
    toggleChecklist(id: string, checklistId: string, checked: boolean): Promise<{
        success: boolean;
        data: {
            id: string;
            serviceOrderId: string;
            item: string;
            checked: boolean;
        };
    }>;
}
