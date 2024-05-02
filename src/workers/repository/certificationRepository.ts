import { Repository } from 'typeorm';
import { Certification } from '../entities/certification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCertificationDto } from '../dto/create-certification.dto';

export class CertificationRepository {
  constructor(
    @InjectRepository(Certification)
    private readonly db: Repository<Certification>,
  ) {}

  async addCertification(data: CreateCertificationDto) {
    try {
      return await this.db.save(data);
    } catch (error) {
      console.log('ERROR GUARDANDO CERTIFICACION:', error);
      throw new Error(`ERROR GUARDANDO CERTIFICACION: ${error}`);
    }
  }
}
