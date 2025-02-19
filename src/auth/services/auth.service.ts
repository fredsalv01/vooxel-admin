import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

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
      this.logger.error(`Usuario ${email} no encontrado`);
      throw new UnauthorizedException({
        error: `Usuario ${email} no encontrado`,
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.error(`Contraseña incorrecta para el usuario: ${email}`);
      throw new UnauthorizedException({
        error: `Contraseña incorrecta para el usuario: ${email}`,
      });
    }

    if (!user.isActive) {
      this.logger.error(`El usuario no esta activo: ${email}`);
      throw new UnauthorizedException({
        error: `El usuario no esta activo`,
      });
    }

    return user;
  }

  refresh(token: string) {
    try {
      const user = this.jwtService.decode(token) as JwtPayload;
      return {
        token: this.getJwtToken(new User({ id: user.sub, email: user.email })),
      };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException({
        error: 'El token no es válido',
      });
    }
  }
}
