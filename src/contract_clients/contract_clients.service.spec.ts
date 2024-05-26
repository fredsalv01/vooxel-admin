import { Test, TestingModule } from '@nestjs/testing';
import { ContractClientsService } from './contract_clients.service';

describe('ContractClientsService', () => {
  let service: ContractClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractClientsService],
    }).compile();

    service = module.get<ContractClientsService>(ContractClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
