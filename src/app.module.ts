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
  ],
  controllers: [],
  providers: [],
  exports: [AuthModule, BucketModule],
})
export class AppModule {}
