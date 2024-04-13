import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  getJwtToken(request: any): string {
    const data = request;
    return `must return a token with ${data.username} and ${data.password}`;
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.debug(`User ${email} not found!`);
      throw new UnauthorizedException(new Error(`User ${email} not found!`));
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${email}`);
      throw new UnauthorizedException(
        new Error(`Invalid credentials for user ${email}`),
      );
    }

    return user;
  }
}
