"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyStringToNullPipe = void 0;
const common_1 = require("@nestjs/common");
let EmptyStringToNullPipe = class EmptyStringToNullPipe {
    transform(value, metadata) {
        if (metadata.type === 'body' && value && typeof value === 'object') {
            return this.cleanObject(value);
        }
        return value;
    }
    cleanObject(obj) {
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
            }
            else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
                newObj[key] = this.cleanObject(newObj[key]);
            }
        }
        return newObj;
    }
};
exports.EmptyStringToNullPipe = EmptyStringToNullPipe;
exports.EmptyStringToNullPipe = EmptyStringToNullPipe = __decorate([
    (0, common_1.Injectable)()
], EmptyStringToNullPipe);
//# sourceMappingURL=empty-string-to-null.pipe.js.map