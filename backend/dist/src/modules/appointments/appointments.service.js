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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const appointments_repository_1 = require("./appointments.repository");
const conflict_detection_service_1 = require("./conflict-detection.service");
const availability_service_1 = require("./availability.service");
let AppointmentsService = class AppointmentsService {
    repo;
    conflictDetector;
    availabilityService;
    constructor(repo, conflictDetector, availabilityService) {
        this.repo = repo;
        this.conflictDetector = conflictDetector;
        this.availabilityService = availabilityService;
    }
    async create(createDto, companyId) {
        const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force, } = createDto;
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de término.');
        }
        if (clientId)
            await this.conflictDetector.ensureClientExists(clientId, companyId);
        if (serviceOrderId)
            await this.conflictDetector.ensureServiceOrderExists(serviceOrderId, companyId);
        if (technicianId) {
            await this.conflictDetector.ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force);
        }
        const appointment = await this.repo.create({
            companyId,
            title,
            description,
            startTime: start,
            endTime: end,
            clientId: clientId || null,
            technicianId: technicianId,
            serviceOrderId: serviceOrderId || null,
        });
        return { success: true, data: appointment };
    }
    async findAll(companyId, startDate, endDate, technicianId, clientId) {
        const appointments = await this.repo.findMany({
            companyId,
            startDate,
            endDate,
            technicianId,
            clientId,
        });
        return { success: true, data: appointments };
    }
    async findOne(id, companyId) {
        const appointment = await this.repo.findByIdAndCompany(id, companyId);
        if (!appointment) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        return { success: true, data: appointment };
    }
    async update(id, updateDto, companyId) {
        const existing = await this.repo.findByIdAndCompany(id, companyId);
        if (!existing) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force, } = updateDto;
        const start = startTime ? new Date(startTime) : existing.startTime;
        const end = endTime ? new Date(endTime) : existing.endTime;
        if (start >= end) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de término.');
        }
        if (clientId && clientId !== existing.clientId) {
            await this.conflictDetector.ensureClientExists(clientId, companyId);
        }
        if (serviceOrderId && serviceOrderId !== existing.serviceOrderId) {
            await this.conflictDetector.ensureServiceOrderExists(serviceOrderId, companyId);
        }
        if (technicianId &&
            (technicianId !== existing.technicianId || startTime || endTime)) {
            await this.conflictDetector.ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force, id);
        }
        const updated = await this.repo.update(id, {
            title: title !== undefined ? title : existing.title,
            description: description !== undefined ? description : existing.description,
            startTime: start,
            endTime: end,
            client: clientId !== undefined ? { connect: { id: clientId } } : undefined,
            technician: technicianId !== undefined
                ? { connect: { id: technicianId } }
                : undefined,
            serviceOrder: serviceOrderId !== undefined
                ? { connect: { id: serviceOrderId } }
                : undefined,
        });
        return { success: true, data: updated };
    }
    async remove(id, companyId) {
        const existing = await this.repo.findByIdAndCompany(id, companyId);
        if (!existing) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        await this.repo.update(id, { deletedAt: new Date() });
        return { success: true, data: { id } };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointments_repository_1.AppointmentsRepository,
        conflict_detection_service_1.ConflictDetectionService,
        availability_service_1.AvailabilityService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map