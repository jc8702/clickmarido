import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateAppointmentDto, companyId: string): Promise<{
        success: boolean;
        conflict: boolean;
        message: string;
        data: {
            technician: {
                name: string;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
    } | {
        success: boolean;
        data: {
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
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
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
                clientRating: number | null;
                clientReview: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
        conflict?: undefined;
        message?: undefined;
    }>;
    findAll(companyId: string, startDate?: string, endDate?: string, technicianId?: string, clientId?: string): Promise<{
        success: boolean;
        data: ({
            client: {
                id: string;
                name: string;
                phone: string;
                whatsapp: string | null;
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
                number: number;
                id: string;
                status: string;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        })[];
    }>;
    findOne(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
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
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
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
                clientRating: number | null;
                clientReview: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
    }>;
    update(id: string, updateDto: UpdateAppointmentDto, companyId: string): Promise<{
        success: boolean;
        conflict: boolean;
        message: string;
        data: {
            technician: {
                name: string;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
    } | {
        success: boolean;
        data: {
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
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
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
                clientRating: number | null;
                clientReview: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            clientId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
        conflict?: undefined;
        message?: undefined;
    }>;
    remove(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
