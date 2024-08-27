import { Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from '../dto/create-contact.dto';
import { ContactRepository } from '../repository/contactRepository';
import { UpdateContactDto } from '../dto/update-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly contactRepository: ContactRepository) {}

  create(createContactDto: CreateContactDto) {
    this.logger.debug(
      `create contact method - DataToDB ${this.create.name}:`,
      JSON.stringify(createContactDto, null, 2),
    );
    return this.contactRepository.addContact(createContactDto);
  }

  findAll(clientId: number) {
    return this.contactRepository.findAll(clientId);
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return this.contactRepository.update(id, updateContactDto);
  }

  remove(id: number) {
    return this.contactRepository.delete(id);
  }
}
