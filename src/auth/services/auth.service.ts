import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  getJwtToken(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.debug(`Usuario ${email} no encontrado`);
      throw new UnauthorizedException(
        new Error(`Usuario ${email} no encontrado`),
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Credenciales invalidas para el usuario: ${email}`);
      throw new UnauthorizedException(
        new Error(`Credenciales invalidas para el usuario: ${email}`),
      );
    }

    return user;
  }

  refresh(token: string) {
    try {
      const user = this.jwtService.decode(token);
      return {
        token: this.getJwtToken(user),
      };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('El token no es válido');
    }
  }
}
