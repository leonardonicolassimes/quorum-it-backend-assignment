import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';

const mockPermissionRepository = {};
const mockUserPermissionRepository = {};
const mockRolePermissionRepository = {};

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: 'PermissionRepository', useValue: mockPermissionRepository },
        {
          provide: 'UserPermissionRepository',
          useValue: mockUserPermissionRepository,
        },
        {
          provide: 'RolePermissionRepository',
          useValue: mockRolePermissionRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
