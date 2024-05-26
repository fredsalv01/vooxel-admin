import { BankAccountRepository } from './../repository/bankAccountRepository';
import { Injectable, Logger } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';

@Injectable()
export class BankAccountService {
  private readonly logger = new Logger(BankAccountService.name);
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  findByWorkerId(id: number) {
    this.logger.debug(this.findByWorkerId.name);

    return this.bankAccountRepository.findBankAccount(id);
  }

  async create(bankAccountDto: CreateBankAccountDto) {
    this.logger.debug(this.create.name);
    const { workerId, ...rest } = bankAccountDto;
    return this.bankAccountRepository.create(bankAccountDto);
  }

  updateState(bankId: number) {
    this.logger.debug(this.updateState.name);
    return this.bankAccountRepository.updateState(bankId);
  }
}
