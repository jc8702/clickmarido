import { Test, TestingModule } from '@nestjs/testing';
import { FinancialValidationService } from './financial-validation.service';
import { BadRequestException } from '@nestjs/common';

describe('FinancialValidationService', () => {
  let service: FinancialValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialValidationService],
    }).compile();

    service = module.get<FinancialValidationService>(FinancialValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate transaction successfully', () => {
    expect(() => service.validateTransaction({ value: 100, dueDate: new Date(), type: 'RECEITA' })).not.toThrow();
  });

  it('should throw if value is zero or missing', () => {
    expect(() => service.validateTransaction({ dueDate: new Date(), type: 'RECEITA' })).toThrow(BadRequestException);
    expect(() => service.validateTransaction({ value: 0, dueDate: new Date(), type: 'RECEITA' })).toThrow(BadRequestException);
  });

  it('should throw if dueDate is missing', () => {
    expect(() => service.validateTransaction({ value: 100, type: 'RECEITA' })).toThrow(BadRequestException);
  });

  it('should throw if type is invalid', () => {
    expect(() => service.validateTransaction({ value: 100, dueDate: new Date(), type: 'INVALID' })).toThrow(BadRequestException);
  });

  it('should validate summary params', () => {
    expect(() => service.validateSummaryParams('comp-1')).not.toThrow();
  });

  it('should throw if companyId is missing for summary params', () => {
    expect(() => service.validateSummaryParams('')).toThrow(BadRequestException);
  });
});
