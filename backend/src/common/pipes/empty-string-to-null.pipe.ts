import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringToNullPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value && typeof value === 'object') {
      return this.cleanObject(value);
    }
    return value;
  }

  private cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.cleanObject(item));
    }

    if (obj instanceof Date) {
      return obj;
    }

    const newObj = { ...obj };
    for (const key in newObj) {
      if (newObj[key] === '') {
        newObj[key] = null;
      } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
        newObj[key] = this.cleanObject(newObj[key]);
      }
    }
    return newObj;
  }
}
