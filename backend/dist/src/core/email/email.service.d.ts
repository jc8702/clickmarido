export declare class EmailService {
    private resend;
    private readonly logger;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<({
        error: import("resend").ErrorResponse;
        data: null;
    } & {
        headers: Record<string, string> | null;
    }) | ({
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }) | {
        id: string;
    }>;
    sendPasswordReset(to: string, resetLink: string): Promise<({
        error: import("resend").ErrorResponse;
        data: null;
    } & {
        headers: Record<string, string> | null;
    }) | ({
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }) | {
        id: string;
    }>;
    sendWelcomeEmail(to: string, name: string): Promise<({
        error: import("resend").ErrorResponse;
        data: null;
    } & {
        headers: Record<string, string> | null;
    }) | ({
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }) | {
        id: string;
    }>;
    sendOsCompletedEmail(to: string, clientName: string, osNumber: number): Promise<({
        error: import("resend").ErrorResponse;
        data: null;
    } & {
        headers: Record<string, string> | null;
    }) | ({
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }) | {
        id: string;
    }>;
}
