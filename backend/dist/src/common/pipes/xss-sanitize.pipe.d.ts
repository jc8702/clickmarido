import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class XssSanitizePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private isObj;
    private sanitizeObject;
}
