import { GlobalExceptionFilter } from './global-exception.filter';
import { LoggerService } from '../../core/logger/logger.service';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ClientException } from '../exceptions/client.exception';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = {
      error: jest.fn(),
      warn: jest.fn(),
    } as any;
    filter = new GlobalExceptionFilter(loggerService);
  });

  it('should format HttpException correctly', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    const mockGetRequest = jest.fn().mockReturnValue({ url: '/api/test', method: 'GET', requestId: 'req-123' });

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequest,
      }),
    } as unknown as ArgumentsHost;

    const exception = new ClientException('Invalid data', 'BAD_REQUEST', { field: 'name' });

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.objectContaining({
        code: 'BAD_REQUEST',
        message: 'Invalid data',
        path: '/api/test',
        requestId: 'req-123',
      })
    }));
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should handle non-HttpExceptions as 500', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    const mockGetRequest = jest.fn().mockReturnValue({ url: '/api/test', method: 'GET', requestId: 'req-123' });

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequest,
      }),
    } as unknown as ArgumentsHost;

    const exception = new Error('Database connection failed');

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.objectContaining({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection failed',
      })
    }));
    expect(loggerService.error).toHaveBeenCalled();
  });
});
