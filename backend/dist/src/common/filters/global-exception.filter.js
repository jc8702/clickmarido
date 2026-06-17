"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../../core/logger/logger.service");
const Sentry = __importStar(require("@sentry/node"));
let GlobalExceptionFilter = class GlobalExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.requestId || 'unknown';
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let message = 'Internal server error';
        let details = undefined;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (exceptionResponse &&
                typeof exceptionResponse === 'object' &&
                'error' in exceptionResponse) {
                const errorObj = exceptionResponse.error;
                if (errorObj) {
                    code = errorObj.code || code;
                    message = errorObj.message || exception.message;
                    details = errorObj.details;
                }
            }
            else if (exceptionResponse && typeof exceptionResponse === 'object') {
                const messageVal = exceptionResponse.message;
                message = Array.isArray(messageVal)
                    ? messageVal.join(', ')
                    : messageVal || exception.message;
                code = exceptionResponse.error || common_1.HttpStatus[status];
            }
            else {
                message =
                    typeof exceptionResponse === 'string'
                        ? exceptionResponse
                        : exception.message;
                code = common_1.HttpStatus[status];
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        const errorPayload = {
            success: false,
            error: {
                code,
                message,
                details,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId,
            },
        };
        const statusCode = status;
        if (statusCode >= 500) {
            this.logger.error(`[${requestId}] ${request.method} ${request.url} - ${message}`, exception instanceof Error ? exception.stack : '');
            Sentry.captureException(exception, {
                tags: { requestId, path: request.url },
            });
        }
        else {
            this.logger.warn(`[${requestId}] ${request.method} ${request.url} - ${status}: ${message}`);
        }
        response.status(statusCode).json(errorPayload);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map