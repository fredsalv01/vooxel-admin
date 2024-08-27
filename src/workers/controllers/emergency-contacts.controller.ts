import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmergencyContactService } from '../services/emergency-contact.service';
import { EmergencyContactDto } from '../dto/create-emergencyContact.dto';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { UpdateEmergencyContactDto } from '../dto/update-emergencyContact.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../../auth/guards/auth-guard-jwt.guard';

@ApiTags('emergency_contacts')
@ApiBearerAuth()
@Controller('emergency_contacts')
export class EmergencyContactsController {
  private readonly logger = new Logger(EmergencyContactsController.name);

  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @HttpCode(201)
  create(@Body() emergencyContactDto: EmergencyContactDto) {
    this.logger.log(
      `${this.create.name} - RequestBody`,
      JSON.stringify(emergencyContactDto, null, 2),
    );
    return this.emergencyContactService.create(
      emergencyContactDto as unknown as EmergencyContact,
    );
  }

  @Get(':workerId')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  getAll(@Param('workerId') workerId: string) {
    this.logger.log(`${this.getAll.name} - QueryParams`, workerId);
    return this.emergencyContactService.getAllFromWorkerId(+workerId);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() emergencyContactDto: UpdateEmergencyContactDto,
  ) {
    this.logger.log(`${this.update.name} - QueryParams`, id);
    this.logger.log(
      `${this.update.name} - RequestBody`,
      JSON.stringify(emergencyContactDto, null, 2),
    );
    return this.emergencyContactService.update(
      +id,
      emergencyContactDto as unknown as EmergencyContact,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  delete(@Param('id') id: string) {
    this.logger.log(`${this.delete.name} - QueryParams`, id);
    return this.emergencyContactService.delete(+id);
  }
}
