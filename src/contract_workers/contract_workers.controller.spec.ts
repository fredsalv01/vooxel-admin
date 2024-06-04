import { Test, TestingModule } from '@nestjs/testing';
import { ContractWorkersController } from './contract_workers.controller';
import { ContractWorkersService } from './contract_workers.service';

describe('ContractWorkersController', () => {
  let controller: ContractWorkersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractWorkersController],
      providers: [ContractWorkersService],
    }).compile();

    controller = module.get<ContractWorkersController>(
      ContractWorkersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
