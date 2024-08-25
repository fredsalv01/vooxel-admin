import { Injectable, Logger } from "@nestjs/common";
import { CreateContactDto } from "../dto/create-contact.dto";
import { ContactRepository } from "../repository/contactRepository";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly contactRepository: ContactRepository
  ){}

  create(createContactDto: CreateContactDto) {
    this.logger.debug(
      `create contact method - DataToDB ${this.create.name}:`,
      JSON.stringify(createContactDto, null, 2),
    );
    return this.contactRepository.addContact(createContactDto);
  }

  findAll() {}

  findOne() {}

  update() {}

  remove() {}

}