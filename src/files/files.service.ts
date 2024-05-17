import { Injectable, Logger } from '@nestjs/common';
import { FilesRepository } from './repository/filesRepository';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(private readonly filesRepository: FilesRepository) {}

  create(data: CreateFileDto) {
    this.logger.debug(this.create.name);
    return this.filesRepository.addFile(data);
  }
}
