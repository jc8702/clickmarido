import { HttpException, HttpStatus } from '@nestjs/common';
export declare abstract class BaseException extends HttpException {
    readonly code: string;
    readonly details?: unknown | undefined;
    constructor(code: string, message: string, status: HttpStatus, details?: unknown | undefined);
}
