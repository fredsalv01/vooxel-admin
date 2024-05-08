import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { hashPassword } from './utils/functions';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { retypedPassword, ...restData } = createUserDto;

    const newUser = new User({
      ...restData,
      password: await hashPassword(createUserDto.password),
    });
    const UserDoc = await this.userRepository.save<User>(newUser);

    const { password, ...restUser } = UserDoc;

    return restUser;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    const { password } = resetPasswordDto;

    if (!user) {
      throw new NotFoundException({
        error: 'El token no es válido',
      });
    }

    user.password = await hashPassword(password);
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async getUsers(isActive: boolean, data: { page: number; limit: number }) {
    const users = this.userRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .select([
        'e.id',
        'e.username',
        'e.email',
        'e.firstName',
        'e.lastName',
        'e.isActive',
      ])
      .where('e.isActive = :isActive', { isActive });
    console.log(data.page, data.limit);
    return await paginate(users, {
      limit: data?.limit ?? 0,
      page: data?.page ?? 1,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'email', 'firstName', 'lastName', 'username', 'isActive'],
    });
    if (!user) {
      throw new NotFoundException({
        error: 'No se encontro el usuario',
      });
    }
    return user;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException({
        error: 'Usuario no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException({
        error: error?.detail,
      });
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    if (!user) {
      throw new BadRequestException({
        error: 'Usuario no encontrado, puede estar desactivado',
      });
    }
    this.userRepository.update(id, { isActive: false });
    await this.userRepository.save(user);
    return { message: `User ${user.email} ha sido desactivado` };
  }
}
