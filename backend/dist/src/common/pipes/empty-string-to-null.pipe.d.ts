import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class EmptyStringToNullPipe implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata): unknown;
    private cleanObject;
}
