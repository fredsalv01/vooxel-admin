import { Repository } from 'typeorm';
import { Certification } from '../entities/certification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCertificationDto } from '../dto/create-certification.dto';
import { BadRequestException, Logger } from '@nestjs/common';

export class CertificationRepository {
  private readonly logger = new Logger(CertificationRepository.name);
  constructor(
    @InjectRepository(Certification)
    private readonly db: Repository<Certification>,
  ) {}

  async addCertification(data: CreateCertificationDto) {
    try {
      const result = await this.db.save(data);
      this.logger.debug(
        `${this.addCertification.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.log('ERROR GUARDANDO CERTIFICACION:', error);
      throw new Error(`ERROR GUARDANDO CERTIFICACION: ${error}`);
    }
  }

  async findAllCertifications(workerId: number) {
    try {
      const result = await this.db.findBy({
        workerId,
      });
      this.logger.debug(`${this.findAllCertifications.name} - result`, result);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('ERROR AL LISTAR CERTIFICACIONES');
    }
  }
}
