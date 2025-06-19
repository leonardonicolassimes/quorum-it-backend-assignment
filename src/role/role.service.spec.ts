import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';

const mockRoleRepository = {};
const mockPermissionRepository = {};
const mockRolePermissionRepository = {};
const mockUserRoleRepository = {};

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: 'RoleRepository', useValue: mockRoleRepository },
        { provide: 'PermissionRepository', useValue: mockPermissionRepository },
        {
          provide: 'RolePermissionRepository',
          useValue: mockRolePermissionRepository,
        },
        { provide: 'UserRoleRepository', useValue: mockUserRoleRepository },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
