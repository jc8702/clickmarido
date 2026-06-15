import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export interface AppointmentFilters {
    companyId: string;
    startDate?: string;
    endDate?: string;
    technicianId?: string;
    clientId?: string;
}
export declare class AppointmentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findClient(clientId: string, companyId: string): Promise<{
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
    } | null>;
    findServiceOrder(serviceOrderId: string, companyId: string): Promise<{
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
    } | null>;
    findTechnician(technicianId: string, companyId: string): Promise<{
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
    } | null>;
    findConflictingAppointment(companyId: string, technicianId: string, start: Date, end: Date, excludeId?: string): Promise<({
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
        title: string;
        clientId: string | null;
        startTime: Date;
        endTime: Date;
        technicianId: string | null;
        serviceOrderId: string | null;
    }) | null>;
    create(data: Prisma.AppointmentUncheckedCreateInput): Promise<{
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
    }>;
    findMany(filters: AppointmentFilters): Promise<({
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
    })[]>;
    findByIdAndCompany(id: string, companyId: string): Promise<({
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
    }) | null>;
    update(id: string, data: Prisma.AppointmentUpdateInput): Promise<{
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
    }>;
}
