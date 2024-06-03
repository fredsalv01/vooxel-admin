import { Injectable, Logger } from '@nestjs/common';
import { FilesRepository } from './repository/filesRepository';
import { CreateFileDto } from './dto/create-file.dto';
import { GetFilesDto } from './dto/get-files.dto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(private readonly filesRepository: FilesRepository) {}

  create(data: CreateFileDto) {
    this.logger.debug(this.create.name);
    return this.filesRepository.addFile(data);
  }

  findOne(params: GetFilesDto) {
    this.logger.debug(this.findOne.name);
    return this.filesRepository.getOneFile(params);
  }

  update(id: number, data: CreateFileDto) {
    this.logger.debug(this.update.name);
    return this.filesRepository.updateFile(id, data);
  }
}
