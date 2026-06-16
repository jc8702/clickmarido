import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

@Injectable()
export class XssSanitizePipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    if (this.isObj(value)) {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private isObj(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null;
  }

  private sanitizeObject(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map((item: unknown) => {
        if (typeof item === 'string') return purify.sanitize(item);
        if (this.isObj(item)) return this.sanitizeObject(item);
        return item;
      });
    }

    if (this.isObj(obj)) {
      const cleanObj = { ...obj };
      for (const key in cleanObj) {
        if (Object.prototype.hasOwnProperty.call(cleanObj, key)) {
          const val = cleanObj[key];
          if (typeof val === 'string') {
            cleanObj[key] = purify.sanitize(val);
          } else if (this.isObj(val)) {
            cleanObj[key] = this.sanitizeObject(val);
          }
        }
      }
      return cleanObj;
    }

    return obj;
  }
}
