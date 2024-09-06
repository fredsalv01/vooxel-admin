import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkersModule } from './workers/workers.module';
import { ClientsModule } from './clients/clients.module';
import { BucketModule } from '@app/bucket';
import { FilesModule } from './files/files.module';
import { ContractWorkersModule } from './contract_workers/contract_workers.module';
import { ContractClientsModule } from './contract_clients/contract_clients.module';
import { VacationsModule } from './vacations/vacations.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      // envFilePath: `${process.env.NODE_ENV}.env`,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
      imports: [],
    }),
    AuthModule,
    UsersModule,
    WorkersModule,
    ClientsModule,
    BucketModule,
    FilesModule,
    ContractWorkersModule,
    ContractClientsModule,
    VacationsModule,
    BillingModule,
  ],
  controllers: [],
  providers: [],
  exports: [AuthModule, BucketModule],
})
export class AppModule {}
