import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
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
      throw new ForbiddenException('Invalid Token');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
