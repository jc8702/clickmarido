import { BaseException } from './base.exception';
export declare class InternalServerException extends BaseException {
    constructor(message?: string, code?: string, details?: unknown);
}
