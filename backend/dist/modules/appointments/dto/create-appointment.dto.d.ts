export declare class CreateAppointmentDto {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    clientId?: string;
    technicianId?: string;
    serviceOrderId?: string;
    force?: boolean;
}
export declare class UpdateAppointmentDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    clientId?: string;
    technicianId?: string;
    serviceOrderId?: string;
    force?: boolean;
}
