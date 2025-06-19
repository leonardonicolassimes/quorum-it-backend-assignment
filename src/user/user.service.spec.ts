import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

const mockUserRepository = {};
const mockRoleRepository = {};
const mockPermissionRepository = {};
const mockUserRoleRepository = {};
const mockUserPermissionRepository = {};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: 'RoleRepository', useValue: mockRoleRepository },
        { provide: 'PermissionRepository', useValue: mockPermissionRepository },
        { provide: 'UserRoleRepository', useValue: mockUserRoleRepository },
        {
          provide: 'UserPermissionRepository',
          useValue: mockUserPermissionRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
