import { Injectable } from '@nestjs/common';
import { EmergencyContactRepository } from '../repository/emergencyContactRepository';
import { EmergencyContact } from '../entities/emergency-contact.entity';

@Injectable()
export class EmergencyContactService {
  constructor(
    private readonly EmergencyContactRepository: EmergencyContactRepository,
  ) {}

  async create(
    emergencyContactData: EmergencyContact,
  ): Promise<EmergencyContact> {
    const request = emergencyContactData as unknown as EmergencyContact;
    return await this.EmergencyContactRepository.add(request);
  }

  async getAllFromWorkerId(id: number): Promise<EmergencyContact[]> {
    return await this.EmergencyContactRepository.findAll(id);
  }

  async update(
    id: number,
    emergencyContactData: EmergencyContact,
  ): Promise<EmergencyContact> {
    return await this.EmergencyContactRepository.update(
      id,
      emergencyContactData as unknown as EmergencyContact,
    );
  }

  async delete(id: number): Promise<any> {
    return await this.EmergencyContactRepository.delete(id);
  }
}
