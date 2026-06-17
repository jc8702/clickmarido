"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XssSanitizePipe = void 0;
const common_1 = require("@nestjs/common");
const jsdom_1 = require("jsdom");
const dompurify_1 = __importDefault(require("dompurify"));
const window = new jsdom_1.JSDOM('').window;
const purify = (0, dompurify_1.default)(window);
let XssSanitizePipe = class XssSanitizePipe {
    transform(value, _metadata) {
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
        if (this.isObj(obj)) {
            const cleanObj = { ...obj };
            for (const key in cleanObj) {
                if (Object.prototype.hasOwnProperty.call(cleanObj, key)) {
                    const val = cleanObj[key];
                    if (typeof val === 'string') {
                        cleanObj[key] = purify.sanitize(val);
                    }
                    else if (this.isObj(val)) {
                        cleanObj[key] = this.sanitizeObject(val);
                    }
                }
            }
            return cleanObj;
        }
        return obj;
    }
};
exports.XssSanitizePipe = XssSanitizePipe;
exports.XssSanitizePipe = XssSanitizePipe = __decorate([
    (0, common_1.Injectable)()
], XssSanitizePipe);
//# sourceMappingURL=xss-sanitize.pipe.js.map