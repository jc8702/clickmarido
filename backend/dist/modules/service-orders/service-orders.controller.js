"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrdersController = void 0;
const common_1 = require("@nestjs/common");
const service_orders_service_1 = require("./service-orders.service");
const create_service_order_dto_1 = require("./dto/create-service-order.dto");
const update_service_order_dto_1 = require("./dto/update-service-order.dto");
let ServiceOrdersController = class ServiceOrdersController {
    osService;
    constructor(osService) {
        this.osService = osService;
    }
    create(dto) {
        return this.osService.create(dto);
    }
    generateFromQuote(quoteId) {
        return this.osService.generateFromQuote(quoteId);
    }
    findAll(companyId) {
        return this.osService.findAll(companyId);
    }
    findOne(id) {
        return this.osService.findOne(id);
    }
    update(id, dto) {
        return this.osService.update(id, dto);
    }
    finishOrder(id, signature) {
        return this.osService.finishOrder(id, signature);
    }
    updateStatus(id, status) {
        return this.osService.updateStatus(id, status);
    }
    addPhoto(id, url, type) {
        return this.osService.addPhoto(id, url, type);
    }
    addChecklistItem(id, item) {
        return this.osService.addChecklistItem(id, item);
    }
    toggleChecklist(id, checklistId, checked) {
        return this.osService.toggleChecklist(id, checklistId, checked);
    }
};
exports.ServiceOrdersController = ServiceOrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_order_dto_1.CreateServiceOrderDto]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('from-quote/:quoteId'),
    __param(0, (0, common_1.Param)('quoteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "generateFromQuote", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_order_dto_1.UpdateServiceOrderDto]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/finish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "finishOrder", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Post)(':id/checklist'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('item')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "addChecklistItem", null);
__decorate([
    (0, common_1.Put)(':id/checklist/:checklistId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('checklistId')),
    __param(2, (0, common_1.Body)('checked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "toggleChecklist", null);
exports.ServiceOrdersController = ServiceOrdersController = __decorate([
    (0, common_1.Controller)('service-orders'),
    __metadata("design:paramtypes", [service_orders_service_1.ServiceOrdersService])
], ServiceOrdersController);
//# sourceMappingURL=service-orders.controller.js.map