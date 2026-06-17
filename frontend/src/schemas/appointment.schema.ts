import { z } from 'zod';

export const AppointmentSchema = z
  .object({
    title: z.string().min(1, 'O título do compromisso é obrigatório.'),
    description: z.string().optional(),
    startTime: z.string().min(1, 'Defina a data/hora de início.'),
    endTime: z.string().min(1, 'Defina a data/hora de término.'),
    clientId: z.string().optional(),
    technicianId: z.string().optional(),
    serviceOrderId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return new Date(data.startTime) < new Date(data.endTime);
    },
    {
      message: 'O início deve ser anterior ao término.',
      path: ['endTime'],
    },
  );

export type AppointmentFormData = z.infer<typeof AppointmentSchema>;
