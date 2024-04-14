import { Body, Controller, Post } from '@nestjs/common';
import { EmergencyContactService } from '../services/emergency-contact.service';
import { EmergencyContactDto } from '../dto/create-emergencyContact.dto';
import { EmergencyContact } from '../entities/emergency-contact.entity';

@Controller('emergency_contacts')
export class EmergencyContactsController {
  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  @Post()
  create(@Body() emergencyContactDto: EmergencyContactDto) {
    return this.emergencyContactService.create(
      emergencyContactDto as unknown as EmergencyContact,
    );
  }
}
