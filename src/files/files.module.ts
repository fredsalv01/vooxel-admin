import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { BucketService } from '@app/bucket';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/files.entity';
import { FilesRepository } from './repository/filesRepository';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository, BucketService],
})
export class FilesModule {}
