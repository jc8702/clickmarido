import { BaseException } from './base.exception';
export declare class ConflictException extends BaseException {
    constructor(message?: string, code?: string, details?: any);
}
