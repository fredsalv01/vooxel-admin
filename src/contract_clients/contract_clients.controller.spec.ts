import { Test, TestingModule } from '@nestjs/testing';
import { ContractClientsController } from './contract_clients.controller';
import { ContractClientsService } from './contract_clients.service';

describe('ContractClientsController', () => {
  let controller: ContractClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractClientsController],
      providers: [ContractClientsService],
    }).compile();

    controller = module.get<ContractClientsController>(ContractClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
