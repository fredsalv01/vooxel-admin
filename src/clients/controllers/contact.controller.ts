import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from '../../auth/guards/auth-guard-jwt.guard';
import { CreateContactDto } from '../dto/create-contact.dto';
import { ContactService } from '../services/contact.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateContactDto } from '../dto/update-contact.dto';

@ApiTags('contact')
@ApiBearerAuth()
@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() createContactDto: CreateContactDto) {
    this.logger.log(this.create.name);
    this.logger.log(`${createContactDto} - body`);
    return this.contactService.create(createContactDto);
  }

  @Get('/client/:clientId')
  @UseGuards(AuthGuardJwt)
  async findAll(@Param('clientId', ParseIntPipe) clientId: number) {
    this.logger.log(this.findAll.name);
    this.logger.log(`params - clientId: ${clientId}`);
    return this.contactService.findAll(clientId);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    this.logger.log(this.update.name);
    this.logger.log(`params - clientId: ${id}`);
    this.logger.log(
      `updateContactDto - body`,
      JSON.stringify(updateContactDto, null, 2),
    );
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  delete(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`${this.delete.name} - QueryParams`, id);
    return this.contactService.remove(id);
  }
}
