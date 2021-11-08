import { Resolver, Args, Query, Context } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-core';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query('login')
  async login(@Args('user') user: any): Promise<any> {
    const result = await this.authService.validateUserByPassword(user);

    if (result) return result;

    throw new AuthenticationError('Could not log-in with the provided credentials');
  }

  // There is no username guard here because if the person has the token, they can be any user
  @Query('refreshToken')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any): Promise<string> {
    const user: UserDocument = request.user;

    if (!user) {
      throw new AuthenticationError('Could not log-in with the provided credentials');
    }

    const result = await this.authService.createJwt(user);

    if (result) return result.token;

    throw new AuthenticationError('Could not log-in with the provided credentials');
  }
}
