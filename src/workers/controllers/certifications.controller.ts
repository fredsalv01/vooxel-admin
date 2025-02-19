import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCertificationDto } from '../dto/create-certification.dto';
import { CertificationsService } from '../services/certifications.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('certifications')
@ApiBearerAuth()
@Controller('certifications')
export class CertificationController {
  private readonly logger = new Logger(CertificationController.name);
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuardJwt)
  async create(@Body() createCertificationDto: CreateCertificationDto) {
    this.logger.log(
      `${this.create.name} - RequestBody`,
      JSON.stringify(createCertificationDto, null, 2),
    );
    return this.certificationsService.create(createCertificationDto);
  }

  @Get(':workerId')
  @HttpCode(200)
  @UseGuards(AuthGuardJwt)
  async getAll(@Param('workerId') workerId: string) {
    this.logger.log(`${this.getAll.name} - QueryParams`, workerId);
    return this.certificationsService.findAll(+workerId);
  }
}
