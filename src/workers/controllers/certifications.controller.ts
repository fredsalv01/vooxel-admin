import { Body, Controller, Post } from '@nestjs/common';
import { CreateCertificationDto } from '../dto/create-certification.dto';

@Controller()
export class CertificationController {
  @Post()
  async create(@Body() createCertificationDto: CreateCertificationDto) {
    return 'Se ha creado una certificacion';
  }
}
