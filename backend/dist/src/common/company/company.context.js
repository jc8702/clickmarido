"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyContext = void 0;
const async_hooks_1 = require("async_hooks");
class CompanyContext {
    static storage = new async_hooks_1.AsyncLocalStorage();
    static run(store, callback) {
        return this.storage.run(store, callback);
    }
    static getStore() {
        return this.storage.getStore();
    }
    static getCompanyId() {
        return this.storage.getStore()?.companyId;
    }
    static getUserId() {
        return this.storage.getStore()?.userId;
    }
}
exports.CompanyContext = CompanyContext;
//# sourceMappingURL=company.context.js.map