import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BankAccount } from './../entities/bank-account.entity';

export class BankAccountRepository {
  private readonly logger = new Logger(BankAccountRepository.name);

  constructor(
    @InjectRepository(BankAccount)
    private readonly db: Repository<BankAccount>
  ){}


  async findBankAccount(workerId: number){
    const result = await this.db.find({
      where: {
        workerId
      }
    })

    this.logger.debug(
      `${this.findBankAccount.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async create(data: any){
    try {
      const result = await this.db.save(new BankAccount(data))
      this.logger.debug(
        `${this.create.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO CUENTA DE BANCO:', error);
      throw new Error(error);
    }
  }

}