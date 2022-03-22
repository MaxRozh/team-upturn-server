import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersService } from '../../users/users.service';

@Injectable()
export class NicknameEmailAdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService, private readonly reflector: Reflector) {}

  // Returns an array of all the properties of an object separated by a .
  getPropertiesArray(object: any): string[] {
    let result: string[] = [];

    Object.entries(object).forEach(([key, value]) => {
      const field = key;

      if (typeof value === 'object' && value !== null) {
        const objectProperties = this.getPropertiesArray(value).map((prop) => `${field}.${prop}`);
        result = result.concat(objectProperties);
      } else {
        result.push(field);
      }
    });

    return result;
  }

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

      if (shouldActivate === false && this.usersService.isAdmin(user.permissions)) {
        const adminAllowedArgs = this.reflector.get<string[]>('adminAllowedArgs', context.getHandler());

        shouldActivate = true;

        if (adminAllowedArgs) {
          const argFields = this.getPropertiesArray(args);

          argFields.forEach((field) => {
            if (!adminAllowedArgs.includes(field)) {
              throw new UnauthorizedException(`Admin is not allowed to modify ${field}`);
            }
          });
        }
      }
    }

    if (!shouldActivate) {
      throw new UnauthorizedException('Could not authenticate with token');
    }

    return shouldActivate;
  }
}
