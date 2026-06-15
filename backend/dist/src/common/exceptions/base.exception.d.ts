import { HttpException, HttpStatus } from '@nestjs/common';
export declare abstract class BaseException extends HttpException {
    readonly code: string;
    readonly details?: any | undefined;
    constructor(code: string, message: string, status: HttpStatus, details?: any | undefined);
}
