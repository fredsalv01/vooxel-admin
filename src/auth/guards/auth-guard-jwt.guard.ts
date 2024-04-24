import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { JsonWebTokenError } from '@nestjs/jwt';

export class AuthGuardJwt extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof JsonWebTokenError) {
      console.log(info);
      throw new UnauthorizedException('Invalid Token!');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
