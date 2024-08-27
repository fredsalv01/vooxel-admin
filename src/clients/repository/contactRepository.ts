import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entities/contact.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateContactDto } from '../dto/create-contact.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

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
      this.logger.error('ERROR GUARDANDO CONTACTO:', error);
      throw new Error(error);
    }
  }

  async findAll(clientId: number) {
    try {
      const result = await this.db.find({
        where: {
          client: {
            id: clientId,
          },
        },
      });
      this.logger.debug(
        `${this.findAll.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR LISTANDO CONTACTOS:', error);
      throw new Error(error);
    }
  }

  async update(id: number, updateContactData: any) {
    const contact: Contact = await this.db.preload({
      id: id,
      ...updateContactData,
    });

    if (!contact) {
      throw new NotFoundException({
        error: 'Contacto no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(contact);

      await queryRunner.commitTransaction();
      return contact;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number) {
    try {
      const result = await this.db.delete(id);
      this.logger.debug(
        `${this.delete.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.log('ERROR AL ELIMINAR EL CONTACTO DEL CLIENTE:', error);
      throw new Error(error);
    }
  }
}
