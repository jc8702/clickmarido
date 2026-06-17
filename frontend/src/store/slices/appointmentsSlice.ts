import { StateCreator } from 'zustand';
import { RootState } from '../types';

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
}

export interface AppointmentsSlice {
  appointments: Appointment[];
  loadingAppointments: boolean;

  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (app: Appointment) => void;
  removeAppointment: (id: string) => void;
}

export const createAppointmentsSlice: StateCreator<
  RootState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  AppointmentsSlice
> = (set) => ({
  appointments: [],
  loadingAppointments: false,

  setAppointments: (appointments) => set({ appointments }, false, 'appointments/setAppointments'),
  addAppointment: (app) =>
    set(
      (state) => ({ appointments: [...state.appointments, app] }),
      false,
      'appointments/addAppointment',
    ),
  removeAppointment: (id) =>
    set(
      (state) => ({
        appointments: state.appointments.filter((a) => a.id !== id),
      }),
      false,
      'appointments/removeAppointment',
    ),
});
