import { AsyncLocalStorage } from 'async_hooks';

export interface CompanyStore {
  companyId: string;
  userId?: string;
}

export class CompanyContext {
  private static readonly storage = new AsyncLocalStorage<CompanyStore>();

  static run<T>(store: CompanyStore, callback: () => T): T {
    return this.storage.run(store, callback);
  }

  static getStore(): CompanyStore | undefined {
    return this.storage.getStore();
  }

  static getCompanyId(): string | undefined {
    return this.storage.getStore()?.companyId;
  }

  static getUserId(): string | undefined {
    return this.storage.getStore()?.userId;
  }

  static setCompanyId(companyId: string): void {
    const store = this.storage.getStore();
    if (store) {
      store.companyId = companyId;
    }
  }

  static setUserId(userId: string): void {
    const store = this.storage.getStore();
    if (store) {
      store.userId = userId;
    }
  }
}
