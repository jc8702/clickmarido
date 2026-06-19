import { SetMetadata } from '@nestjs/common';

export const AUDIT_REPORT_ACCESS_KEY = 'audit_report_access';
export const AuditReportAccess = () => SetMetadata(AUDIT_REPORT_ACCESS_KEY, true);