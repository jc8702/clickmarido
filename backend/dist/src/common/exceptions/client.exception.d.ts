import { BaseException } from './base.exception';
export declare class ClientException extends BaseException {
    constructor(message: string, code?: string, details?: unknown);
}
