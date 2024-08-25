import { Body, Controller, Logger, Post, UseGuards } from "@nestjs/common";
import { AuthGuardJwt } from "../../auth/guards/auth-guard-jwt.guard";
import { CreateContactDto } from "../dto/create-contact.dto";
import { ContactService } from "../services/contact.service";

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);
  
  constructor(
    private readonly contactService: ContactService 
  ){}

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() createContactDto: CreateContactDto
  ){
    this.logger.log(this.create.name)
    this.logger.log(`${createContactDto} - body`)
    return this.contactService.create(createContactDto);
  }

}