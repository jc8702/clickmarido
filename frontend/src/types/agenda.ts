export type CalendarView = 'day' | 'week' | 'month';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  clientId?: string;
  serviceOrderId?: string;
  technicianId?: string;
  client?: {
    id: string;
    name: string;
    phone?: string;
    whatsapp?: string;
  };
  technician?: {
    id: string;
    name: string;
  };
  serviceOrder?: {
    id: string;
    number: string;
    status: string;
  };
}

export interface AppointmentFormData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  clientId?: string;
  technicianId?: string;
  serviceOrderId?: string;
  force?: boolean;
}

export interface ConflictInfo {
  message: string;
  data: Appointment;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}
