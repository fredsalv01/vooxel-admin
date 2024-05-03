import { InjectRepository } from '@nestjs/typeorm';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class EmergencyContactRepository {
  private readonly logger = new Logger(EmergencyContactRepository.name);
  constructor(
    @InjectRepository(EmergencyContact)
    private readonly db: Repository<EmergencyContact>,
  ) {}

  async add(data: EmergencyContact) {
    try {
      const result = await this.db.save(data);
      this.logger.debug(
        `${this.add.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.log('ERROR GUARDANDO CONTACTO DE EMERGENCIA:', error);
      throw new Error(`ERROR GUARDANDO CONTACTO DE EMERGENCIA: ${error}`);
    }
  }

  async findAll(id: number) {
    try {
      const result = await this.db.find({
        where: {
          worker: {
            id: id,
          },
        },
      });
      this.logger.debug(
        `${this.findAll.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.log('ERROR OBTENIENDO LISTA DE CONTACTOS DE EMERGENCIA:', error);
      throw new Error(error);
    }
  }

  async update(id: number, data: EmergencyContact) {
    try {
      const result = await this.db.update(
        {
          id,
        },
        data,
      );
      this.logger.debug(
        `${this.update.name} - result`,
        JSON.stringify(result.raw, null, 2),
      );
      return result.raw;
    } catch (error) {
      console.log(
        'ERROR AL ACTUALIZAR LISTA DE CONTACTOS DE EMERGENCIA:',
        error,
      );
      throw new Error(error);
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
      console.log('ERROR AL ELIMINAR LISTA DE CONTACTOS DE EMERGENCIA:', error);
      throw new Error(error);
    }
  }
}
