import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
@ValidatorConstraint({ async: true })
export class UserDoesNotExistsConstrint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    console.log('value', value);
    console.log('validationArgument', validationArguments);
    const entity = await this.userRepository.findOneBy({
      [validationArguments.property]: value,
    });
    return entity === null;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already taken`;
  }
}

export function UserDoesNotExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserDoesNotExistsConstrint,
    });
  };
}
