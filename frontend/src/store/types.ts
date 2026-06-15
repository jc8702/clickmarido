import { AuthSlice } from './slices/authSlice';
import { ClientsSlice } from './slices/clientsSlice';
import { AppointmentsSlice } from './slices/appointmentsSlice';
import { FinancialSlice } from './slices/financialSlice';
import { UiSlice } from './slices/uiSlice';

export type RootState = AuthSlice & 
  ClientsSlice & 
  AppointmentsSlice & 
  FinancialSlice & 
  UiSlice;
