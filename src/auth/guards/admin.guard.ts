import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      const user = request.user;
      if (this.usersService.isAdmin(user.permissions)) return true;
    }

    throw new ForbiddenException('Could not authenticate with token or user does not have permissions');
  }
}
