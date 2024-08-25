import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entities/contact.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateContactDto } from '../dto/create-contact.dto';
import { Logger } from '@nestjs/common';

export class ContactRepository {
  private readonly logger = new Logger(ContactRepository.name);
  constructor(
    @InjectRepository(Contact)
    private readonly db: Repository<Contact>,
    private readonly dataSource: DataSource,
  ) {}

  async addContact(data: CreateContactDto) {
    try {
      const result = await this.db.save(new Contact(data));
      this.logger.debug(
        `${this.addContact.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO CONTACT:', error);
      throw new Error(error);
    }
  }
  
}
