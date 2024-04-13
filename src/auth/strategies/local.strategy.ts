import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly authService: AuthService,
  ) {
    // esto permite que la local strategy use el email en vez de username
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string): Promise<any> {
    return await this.authService.validateUser(email, password);
  }
}
