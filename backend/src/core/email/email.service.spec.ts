const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    mockSend.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should simulate when NODE_ENV is not production and no API key', async () => {
      const originalEnv = process.env.NODE_ENV;
      const originalKey = process.env.RESEND_API_KEY;
      process.env.NODE_ENV = 'development';
      delete process.env.RESEND_API_KEY;

      const result = await service.sendEmail(
        'test@test.com',
        'Test',
        '<p>Test</p>',
      );

      expect(result).toEqual({ id: 'simulated' });

      process.env.NODE_ENV = originalEnv;
      process.env.RESEND_API_KEY = originalKey;
    });

    it('should call Resend API in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      const originalKey = process.env.RESEND_API_KEY;
      process.env.NODE_ENV = 'production';
      process.env.RESEND_API_KEY = 're_real_key';
      mockSend.mockResolvedValue({ id: 'real-id' });

      const result = await service.sendEmail(
        'test@test.com',
        'Test',
        '<p>Test</p>',
      );

      expect(result).toEqual({ id: 'real-id' });
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@test.com',
          subject: 'Test',
        }),
      );

      process.env.NODE_ENV = originalEnv;
      process.env.RESEND_API_KEY = originalKey;
    });
  });

  describe('sendPasswordReset', () => {
    it('should call sendEmail with reset HTML', async () => {
      mockSend.mockResolvedValue({ id: 'simulated' });

      const result = await service.sendPasswordReset(
        'user@test.com',
        'https://clickmarido.com/reset/token',
      );

      expect(result).toBeDefined();
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should call sendEmail with welcome HTML', async () => {
      mockSend.mockResolvedValue({ id: 'simulated' });

      const result = await service.sendWelcomeEmail(
        'user@test.com',
        'João',
      );

      expect(result).toBeDefined();
    });
  });

  describe('sendOsCompletedEmail', () => {
    it('should call sendEmail with OS completed HTML', async () => {
      mockSend.mockResolvedValue({ id: 'simulated' });

      const result = await service.sendOsCompletedEmail(
        'client@test.com',
        'Maria',
        12345,
      );

      expect(result).toBeDefined();
    });
  });
});
