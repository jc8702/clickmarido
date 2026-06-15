import { Appointment } from '@prisma/client';

export const AppointmentFactory = {
  build: (overrides?: Partial<Appointment>): Appointment => {
    return {
      id: 'appointment-uuid-1',
      companyId: 'company-uuid-1',
      title: 'Test Appointment',
      description: 'Appointment description',
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 3600000), // 1 hour later
      clientId: null,
      technicianId: null,
      serviceOrderId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
