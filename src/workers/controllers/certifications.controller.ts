import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateCertificationDto } from '../dto/create-certification.dto';
import { CertificationsService } from '../services/certifications.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('certifications')
@ApiBearerAuth()
@Controller('certifications')
export class CertificationController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuardJwt)
  async create(@Body() createCertificationDto: CreateCertificationDto) {
    return this.certificationsService.create(createCertificationDto);
  }
}
