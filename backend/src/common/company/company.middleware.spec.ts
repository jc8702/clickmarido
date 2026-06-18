import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { CompanyMiddleware } from './company.middleware';
import { CompanyContext } from './company.context';

describe('CompanyMiddleware', () => {
  let middleware: CompanyMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyMiddleware],
    }).compile();

    middleware = module.get<CompanyMiddleware>(CompanyMiddleware);
  });

  afterEach(() => {
    // Limpar o contexto após cada teste
    const store = CompanyContext.getStore();
    if (store) {
      CompanyContext.run({}, () => {});
    }
  });

  it('should initialize context when companyId is found in headers', () => {
    let capturedCompanyId: string | undefined;
    
    const mockRequest = {
      headers: {
        'x-company-id': 'test-company-from-header',
      },
    } as Request;

    const mockResponse = {} as Response;
    const next = jest.fn(() => {
      // Capturar o contexto dentro do callback do next()
      capturedCompanyId = CompanyContext.getCompanyId();
    });

    middleware.use(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(capturedCompanyId).toBe('test-company-from-header');
  });

  it('should initialize context when companyId is in query string', () => {
    let capturedCompanyId: string | undefined;
    
    const mockRequest = {
      headers: {},
      query: {
        companyId: 'test-company-from-query',
      },
    } as any as Request;

    const mockResponse = {} as Response;
    const next = jest.fn(() => {
      capturedCompanyId = CompanyContext.getCompanyId();
    });

    middleware.use(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(capturedCompanyId).toBe('test-company-from-query');
  });

  it('should not initialize context when no companyId (public route)', () => {
    let capturedCompanyId: string | undefined;
    
    const mockRequest = {
      headers: {},
    } as Request;

    const mockResponse = {} as Response;
    const next = jest.fn(() => {
      capturedCompanyId = CompanyContext.getCompanyId();
    });

    middleware.use(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(capturedCompanyId).toBeUndefined();
  });

  it('should initialize context when JWT contains companyId', () => {
    let capturedCompanyId: string | undefined;
    
    const mockRequest = {
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29tcGFueUlkIjoidGVzdC1jb21wYW55In0.test',
      },
    } as Request;

    const mockResponse = {} as Response;
    const next = jest.fn(() => {
      capturedCompanyId = CompanyContext.getCompanyId();
    });

    // Mock do atob para simular JWT decode com companyId
    const originalAtob = global.atob;
    global.atob = jest.fn(() => JSON.stringify({
      sub: '1234567890',
      companyId: 'test-company-from-jwt'
    }));

    middleware.use(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(capturedCompanyId).toBe('test-company-from-jwt');

    // Restaurar atob original
    global.atob = originalAtob;
  });

  it('should handle malformed JWT gracefully', () => {
    let capturedCompanyId: string | undefined;
    
    const mockRequest = {
      headers: {
        authorization: 'Bearer malformed-jwt-token',
      },
    } as Request;

    const mockResponse = {} as Response;
    const next = jest.fn(() => {
      capturedCompanyId = CompanyContext.getCompanyId();
    });

    // Mock do decode para lançar erro
    const originalDecode = global.decode;
    global.decode = jest.fn(() => {
      throw new Error('Invalid token');
    });

    middleware.use(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(capturedCompanyId).toBeUndefined();

    // Restaurar decode original
    global.decode = originalDecode;
  });
});