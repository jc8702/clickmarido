export interface CompanyStore {
    companyId: string;
    userId?: string;
}
export declare class CompanyContext {
    private static readonly storage;
    static run<T>(store: CompanyStore, callback: () => T): T;
    static getStore(): CompanyStore | undefined;
    static getCompanyId(): string | undefined;
    static getUserId(): string | undefined;
}
