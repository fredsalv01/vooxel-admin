import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmergencyContactService } from '../services/emergency-contact.service';
import { EmergencyContactDto } from '../dto/create-emergencyContact.dto';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { UpdateEmergencyContactDto } from '../dto/update-emergencyContact.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../../auth/guards/auth-guard-jwt.guard';

@ApiTags('emergency_contacts')
@Controller('emergency_contacts')
export class EmergencyContactsController {
  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @HttpCode(201)
  create(@Body() emergencyContactDto: EmergencyContactDto) {
    return this.emergencyContactService.create(
      emergencyContactDto as unknown as EmergencyContact,
    );
  }

  @Get(':workerId')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  getAll(@Param('workerId') workerId: string) {
    return this.emergencyContactService.getAllFromWorkerId(+workerId);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() emergencyContactDto: UpdateEmergencyContactDto,
  ) {
    return this.emergencyContactService.update(
      +id,
      emergencyContactDto as unknown as EmergencyContact,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.emergencyContactService.delete(+id);
  }
}
