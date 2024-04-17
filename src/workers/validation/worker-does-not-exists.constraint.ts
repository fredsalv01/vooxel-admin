import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from '../entities/worker.entity';

@Injectable()
@ValidatorConstraint({ async: true })
export class WorkerDoesNotExistsConstrint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const entity = await this.workerRepository.findOneBy({
      [validationArguments.property]: value,
    });
    return entity === null;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already taken`;
  }
}

export function WorkerDoesNotExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: WorkerDoesNotExistsConstrint,
    });
  };
}
