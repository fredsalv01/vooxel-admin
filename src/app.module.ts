import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkersModule } from './workers/workers.module';
import { ClientsModule } from './clients/clients.module';

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
  ],
  controllers: [],
  providers: [],
  exports: [AuthModule],
})
export class AppModule {}
