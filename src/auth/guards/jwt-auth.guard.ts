import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

import { ACCESS_TOKEN } from '../auth.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    try {
      const cookie = req.cookies[ACCESS_TOKEN];
      return !!this.jwtService.verify(cookie);
    } catch (e) {
      return false;
    }
  }

  // getRequest(context: ExecutionContext) {
  //   return context.switchToHttp().getRequest();
  // }
  //
  // handleRequest(err: any, user: any, info: any) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('Could not authenticate with token');
  //   }
  //   return user;
  // }
}
