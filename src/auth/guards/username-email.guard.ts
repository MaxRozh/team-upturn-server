import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../../users/users.service';

@Injectable()
export class NicknameEmailGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    let shouldActivate = false;

    if (request.user) {
      const user = request.user;
      const args: any = context.getArgs();

      if (args.nickname && typeof args.nickname === 'string') {
        shouldActivate = args.nickname.toLowerCase() === user.nickname.toLowerCase();
      } else if (args.email && typeof args.email === 'string') {
        shouldActivate = args.email.toLowerCase() === user.email.toLowerCase();
      } else if (!args.nickname && !args.email) {
        shouldActivate = true;
      }
    }

    if (!shouldActivate) {
      throw new UnauthorizedException('Could not authenticate with token');
    }

    return shouldActivate;
  }
}
