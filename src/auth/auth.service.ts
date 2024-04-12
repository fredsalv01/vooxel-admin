import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}
  getJwtToken(request: any): string {
    const data = request;
    return `must return a token with ${data.username} and ${data.password}`;
  }
}
