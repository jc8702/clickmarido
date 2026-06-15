import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { JSDOM } from 'jsdom';

const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const purify = createDOMPurify(window as unknown as Window);

@Injectable()
export class XssSanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (this.isObj(value)) {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === 'string') return purify.sanitize(item);
        if (this.isObj(item)) return this.sanitizeObject(item);
        return item;
      });
    }

    const cleanObj = { ...obj };
    for (const key in cleanObj) {
      if (typeof cleanObj[key] === 'string') {
        cleanObj[key] = purify.sanitize(cleanObj[key]);
      } else if (this.isObj(cleanObj[key])) {
        cleanObj[key] = this.sanitizeObject(cleanObj[key]);
      }
    }
    return cleanObj;
  }
}
