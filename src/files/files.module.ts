import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { BucketService } from '@app/bucket';

@Module({
  controllers: [FilesController],
  providers: [FilesService, BucketService],
})
export class FilesModule {}
