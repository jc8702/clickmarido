"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XssSanitizePipe = void 0;
const common_1 = require("@nestjs/common");
const jsdom_1 = require("jsdom");
const createDOMPurify = require('dompurify');
const window = new jsdom_1.JSDOM('').window;
const purify = createDOMPurify(window);
let XssSanitizePipe = class XssSanitizePipe {
    transform(value, metadata) {
        if (this.isObj(value)) {
            return this.sanitizeObject(value);
        }
        return value;
    }
    isObj(obj) {
        return typeof obj === 'object' && obj !== null;
    }
    sanitizeObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => {
                if (typeof item === 'string')
                    return purify.sanitize(item);
                if (this.isObj(item))
                    return this.sanitizeObject(item);
                return item;
            });
        }
        const cleanObj = { ...obj };
        for (const key in cleanObj) {
            if (typeof cleanObj[key] === 'string') {
                cleanObj[key] = purify.sanitize(cleanObj[key]);
            }
            else if (this.isObj(cleanObj[key])) {
                cleanObj[key] = this.sanitizeObject(cleanObj[key]);
            }
        }
        return cleanObj;
    }
};
exports.XssSanitizePipe = XssSanitizePipe;
exports.XssSanitizePipe = XssSanitizePipe = __decorate([
    (0, common_1.Injectable)()
], XssSanitizePipe);
//# sourceMappingURL=xss-sanitize.pipe.js.map