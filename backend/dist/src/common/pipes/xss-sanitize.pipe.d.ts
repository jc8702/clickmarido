import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class XssSanitizePipe implements PipeTransform {
    transform(value: unknown, _metadata: ArgumentMetadata): unknown;
    private isObj;
    private sanitizeObject;
}
