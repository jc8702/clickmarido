import { SetMetadata } from '@nestjs/common';

export const REPORTS_PERMISSIONS_KEY = 'report_permissions';
export const RequireReportPermissions = (...permissions: string[]) =>
  SetMetadata(REPORTS_PERMISSIONS_KEY, permissions);

export const REPORT_TYPES = {
  DASHBOARD: 'reports:read:dashboard',
  COMMERCIAL: 'reports:read:commercial',
  OPERATIONAL: 'reports:read:operational',
  FINANCIAL: 'reports:read:financial',
  EXPORT: 'reports:export:financial',
} as const;

export type ReportType = keyof typeof REPORT_TYPES;