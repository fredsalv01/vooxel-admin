import { BankAccountRepository } from './../repository/bankAccountRepository';
import { Injectable, Logger } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';

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
    return this.bankAccountRepository.create(bankAccountDto);
  }

  async update(bankId: number, body: UpdateBankAccountDto) {
    this.logger.debug(this.update.name);
    const { workerId, ...rest } = body;
    const bankAccounts = await this.findByWorkerId(workerId);
    const main = bankAccounts.find((item) => item.isMain === true);
    if (main.id !== bankId && rest?.isMain === true) {
      await this.bankAccountRepository.updateState(main.id, {
        isMain: false,
      });
    }
    return this.bankAccountRepository.updateState(bankId, rest);
  }
}
