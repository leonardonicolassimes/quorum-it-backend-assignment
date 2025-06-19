import { Test, TestingModule } from '@nestjs/testing';
import { InitializationService } from './initialization.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';

describe('InitializationService', () => {
  let service: InitializationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitializationService,
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: RoleService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InitializationService>(InitializationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
