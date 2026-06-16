import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringToNullPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type === 'body' && value && typeof value === 'object') {
      return this.cleanObject(value);
    }
    return value;
  }

  private cleanObject(obj: unknown): unknown {
    if (obj === '') {
      return null;
    }

    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item: unknown) => this.cleanObject(item));
    }

    if (obj instanceof Date) {
      return obj;
    }

    const newObj = { ...(obj as Record<string, unknown>) };
    for (const key in newObj) {
      if (Object.prototype.hasOwnProperty.call(newObj, key)) {
        newObj[key] = this.cleanObject(newObj[key]);
      }
    }
    return newObj;
  }
}
