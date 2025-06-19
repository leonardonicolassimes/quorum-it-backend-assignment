import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { SuperAdminInterceptor } from '../shared/interceptors/superadmin.interceptor';
describe('UserController', () => {
  let controller: UsersController;

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        SuperAdminInterceptor,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
