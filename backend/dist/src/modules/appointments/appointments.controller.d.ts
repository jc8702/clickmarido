import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createDto: CreateAppointmentDto): Promise<{
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
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
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
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            clientId: string | null;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
    }>;
    findAll(startDate?: string, endDate?: string, technicianId?: string, clientId?: string): Promise<{
        success: boolean;
        data: ({
            client: {
                name: string;
                id: string;
                phone: string;
                whatsapp: string | null;
            } | null;
            technician: {
                name: string;
                id: string;
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
            title: string;
            clientId: string | null;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        })[];
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
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
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
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            clientId: string | null;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
    }>;
    update(id: string, updateDto: UpdateAppointmentDto): Promise<{
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
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
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
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            clientId: string | null;
            startTime: Date;
            endTime: Date;
            technicianId: string | null;
            serviceOrderId: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
