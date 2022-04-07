import { Injectable, forwardRef, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserModel } from '../users/models/users.model';
import { ACCESS_TOKEN, USER_NOT_FOUND_ERROR, USER_WRONG_PASS_ERROR } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateJwtPayload(payload: JwtPayload): Promise<UserModel | undefined> {
    const user = await this.usersService.findOneByNickname(payload.nickname);

    if (user?.enabled) {
      return this.usersService.updateExistingUser(payload.nickname, { lastSeenAt: new Date() });
    }
  }

  createJwt(user: UserModel): { data: JwtPayload; token: string } {
    const expiresIn = this.configService.get('JWT_EXPIRES_IN');
    let expiration: Date | undefined;

    if (expiresIn) {
      expiration = new Date();
      expiration.setTime(expiration.getTime() + expiresIn * 1000);
    }
    const data: JwtPayload = {
      email: user.email,
      nickname: user.nickname,
      expiration
    };

    return {
      data,
      token: this.jwtService.sign(data)
    };
  }

  async validateUser(email: string, password: string): Promise<{ id: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(USER_WRONG_PASS_ERROR);
    }

    return { id: user._id.toString() };
  }

  async login(id: string) {
    return {
      [ACCESS_TOKEN]: await this.jwtService.signAsync({ id })
    };
  }
}
