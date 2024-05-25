import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BankAccount } from './../entities/bank-account.entity';

export class BankAccountRepository {
  private readonly logger = new Logger(BankAccountRepository.name);

  constructor(
    @InjectRepository(BankAccount)
    private readonly db: Repository<BankAccount>,
    private readonly dataSource: DataSource,
  ) {}

  async findBankAccount(workerId: number) {
    try {
      const result = await this.dataSource
      .getRepository(BankAccount)
      .createQueryBuilder('bankAccount')
      .innerJoin('bankAccount.workers', 'workers')
      .where('worker.id = :workerId', { workerId })
      .where('bankAccount.isActive = :isActive', { isActive: true })
      .getMany();

      this.logger.debug(
        `${this.findBankAccount.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR MOSTRANDO DATOS DE CUENTAS DE BANCO:', error);
      throw new Error(error?.detail);
    }

  }

  async create(data: any) {
    try {
      const result = await this.db.save(new BankAccount(data));
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

  async updateState(id: number) {
    try {
      const validateBankAccount = await this.db.findOne({
        where: {
          id,
        },
      });

      if (!validateBankAccount) {
        throw new NotFoundException(
          `No se encontro el cliente con el id ${id}`,
        );
      }

      const result = await this.db.update(id, {
        isActive: !validateBankAccount,
      });

      this.logger.debug(
        `${this.updateState.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error(error);
      this.logger.error(
        `${this.updateState.name} - error`,
        JSON.stringify(error, null, 2),
      );
      throw new BadRequestException(error?.detail);
    }
  }
}
