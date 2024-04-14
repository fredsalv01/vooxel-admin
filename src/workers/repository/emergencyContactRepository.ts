import { InjectRepository } from '@nestjs/typeorm';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { Repository } from 'typeorm';

export class EmergencyContactRepository {
  constructor(
    @InjectRepository(EmergencyContact)
    private readonly db: Repository<EmergencyContact>,
  ) {}

  async addEmergencyContact(data: EmergencyContact) {
    try {
      return await this.db.save(data);
    } catch (error) {
      console.log('ERROR GUARDANDO CONTACTO DE EMERGENCIA:', error);
      throw new Error(error);
    }
  }
}
