/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { SuperAdminInterceptor } from '../shared/interceptors/superadmin.interceptor';
import { UserService } from 'src/user/user.service';
import { PermissionService } from './permission.service';
describe('PermissionController', () => {
  let controller: PermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: SuperAdminInterceptor,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            intercept: jest.fn((context, next) => next.handle()),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
