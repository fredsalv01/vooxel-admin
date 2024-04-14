import { Injectable, Logger } from '@nestjs/common';
import { EmergencyContactRepository } from '../repository/emergencyContactRepository';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { EmergencyContactDto } from '../dto/create-emergencyContact.dto';

@Injectable()
export class EmergencyContactService {
  private readonly logger = new Logger(EmergencyContactService.name);
  constructor(
    private readonly EmergencyContactRepository: EmergencyContactRepository,
  ) {}

  async create(
    emergencyContactData: EmergencyContact,
  ): Promise<EmergencyContact> {
    return await this.EmergencyContactRepository.add(
      emergencyContactData as unknown as EmergencyContact,
    );
  }

  async getAllFromWorkerId(id: number): Promise<EmergencyContact[]>{
    return await this.EmergencyContactRepository.findAll(id);
  }
}
