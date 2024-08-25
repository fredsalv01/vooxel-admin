import { Module } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { ClientsController } from './controllers/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientRepository } from './repository/clientRepository';
import { Contact } from './entities/contact.entity';
import { ContactController } from './controllers/contact.controller';
import { ContactRepository } from './repository/contactRepository';
import { ContactService } from './services/contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Contact])],
  controllers: [ClientsController, ContactController],
  providers: [
    ClientsService,
    ClientRepository,
    ContactService,
    ContactRepository,
  ],
})
export class ClientsModule {}
