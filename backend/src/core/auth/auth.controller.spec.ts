import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    service.login.mockResolvedValue({ access_token: 'token', user: {} } as any);
    const req = { ip: '127.0.0.1', headers: {}, connection: { remoteAddress: '127.0.0.1' } };
    const result = await controller.login({ email: 'a@b.com', password: '123' }, req as any);
    expect(result.access_token).toBe('token');
  });


});
