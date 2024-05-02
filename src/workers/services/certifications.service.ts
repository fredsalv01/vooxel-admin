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
    return this.certificationRepository.addCertification(data);
  }
}
