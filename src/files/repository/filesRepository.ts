import { InjectRepository } from "@nestjs/typeorm";
import { File } from "../entities/files.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Logger } from "@nestjs/common";

export class FilesRepository{
  
  private readonly logger = new Logger(FilesRepository.name);
  constructor(
    @InjectRepository(File)
    private readonly db: Repository<File>
  ){}

  private getFilesBaseQuery(): SelectQueryBuilder<File>{
    return this.db.createQueryBuilder('file')
    .orderBy('file.created_at', 'DESC')
  }

  async addFile(data: any){
    try {
      const result = await this.db.save(new File(data));
      this.logger.debug(
        `${this.addFile.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO ARCHIVO:', error);
      throw new Error(error);
    }
  }

}