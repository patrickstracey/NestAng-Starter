import { Test, TestingModule } from '@nestjs/testing';
import { AclsService } from './acls.service';

describe('AclsService', () => {
  let service: AclsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AclsService],
    }).compile();

    service = module.get<AclsService>(AclsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
