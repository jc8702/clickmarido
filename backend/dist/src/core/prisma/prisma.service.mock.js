"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = exports.createPrismaMock = void 0;
const createPrismaMock = () => {
    const createModelMock = () => ({
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
        update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
        delete: jest.fn().mockResolvedValue({ id: 1 }),
        count: jest.fn().mockResolvedValue(0),
        groupBy: jest.fn().mockResolvedValue([]),
        aggregate: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    });
    const mock = {
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        $transaction: jest.fn().mockImplementation((callback) => {
            if (typeof callback === 'function') {
                return callback(mock);
            }
            return Promise.all(callback);
        }),
        client: createModelMock(),
        company: createModelMock(),
        user: createModelMock(),
        service: createModelMock(),
        quote: createModelMock(),
        technician: createModelMock(),
        serviceOrder: createModelMock(),
        serviceOrderPhoto: createModelMock(),
        serviceOrderChecklist: createModelMock(),
        financialTransaction: createModelMock(),
        material: createModelMock(),
        materialMovement: createModelMock(),
        warranty: createModelMock(),
        followUp: createModelMock(),
        appointment: createModelMock(),
        conversation: createModelMock(),
        message: createModelMock(),
        appLog: createModelMock(),
        auditLog: createModelMock(),
    };
    return mock;
};
exports.createPrismaMock = createPrismaMock;
exports.prismaMock = (0, exports.createPrismaMock)();
//# sourceMappingURL=prisma.service.mock.js.map