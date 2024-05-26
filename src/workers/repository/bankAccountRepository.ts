import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BankAccount } from './../entities/bank-account.entity';
import { Worker } from '../entities/worker.entity';

export class BankAccountRepository {
  private readonly logger = new Logger(BankAccountRepository.name);

  constructor(
    @InjectRepository(BankAccount)
    private readonly db: Repository<BankAccount>,
    private readonly dataSource: DataSource,
  ) {}

  async findBankAccount(workerId: number) {
    try {
      const query = this.dataSource
        .getRepository(BankAccount)
        .createQueryBuilder('bankAccount')
        .innerJoin('bankAccount.workers', 'worker')
        .where('worker.id = :workerId', { workerId })
        .andWhere('bankAccount.isActive = :isActive', { isActive: true })
        .select([
          'bankAccount.id',
          'bankAccount.bankName',
          'bankAccount.cci',
          'bankAccount.bankAccountNumber',
          'bankAccount.AccountType',
          'bankAccount.isActive',
          'bankAccount.isMain',
        ]);

      this.logger.debug('Generated SQL:', query.getSql());

      const result = await query.getMany();

      this.logger.debug(
        `${this.findBankAccount.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR FETCHING BANK ACCOUNT DATA:', error);
      throw new Error(error?.detail || error.message);
    }
  }

  async findOne(id: number) {
    const result = await this.db.findOne({
      where: {
        id,
      },
    });
    this.logger.debug(
      `${this.findOne.name} - result`,
      JSON.stringify(result, null, 2),
    );
    return result;
  }

  async create(data: any) {
    try {
      const workerRepository = this.dataSource.getRepository(Worker);
      const worker = await workerRepository.findOne({
        where: { id: data.workerId },
        relations: ['bankAccounts'],
      });

      if (!worker) {
        throw new NotFoundException({
          message: `No se ha encontrado el trabajador con el id ${data.workerId}`,
        });
      }

      const result = this.db.create({
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        cci: data.cci,
        isActive: true,
        AccountType: data.AccountType,
        workers: [worker],
      });
      await this.db.save(result);

      worker.bankAccounts.push(result);
      await workerRepository.save(worker);
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

  async updateState(id: number, data: any) {
    const bankAccount: BankAccount = await this.db.preload({
      id: id,
      ...data,
    });

    if (!bankAccount) {
      throw new NotFoundException({
        error: 'Colaborador no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(bankAccount);

      await queryRunner.commitTransaction();
      return bankAccount;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }
}
