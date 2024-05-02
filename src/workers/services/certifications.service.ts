import { Injectable, Logger } from '@nestjs/common';
import { CertificationRepository } from '../repository/certificationRepository';
import { CreateCertificationDto } from '../dto/create-certification.dto';

@Injectable()
export class CertificationsService {
  private readonly logger = new Logger(CertificationsService.name);

  constructor(
    private readonly certificationRepository: CertificationRepository,
  ) {}

  async create(data: CreateCertificationDto) {
    this.logger.debug(`${this.create.name} - data`, data);
    return this.certificationRepository.addCertification(data);
  }

  async findAll(workerId: number) {
    this.logger.debug(`${this.findAll.name} - params`, workerId);
    return this.certificationRepository.findAllCertifications(workerId);
  }
}
