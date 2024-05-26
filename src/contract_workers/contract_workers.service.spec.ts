import { Test, TestingModule } from '@nestjs/testing';
import { ContractWorkersService } from './contract_workers.service';

describe('ContractWorkersService', () => {
  let service: ContractWorkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractWorkersService],
    }).compile();

    service = module.get<ContractWorkersService>(ContractWorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
