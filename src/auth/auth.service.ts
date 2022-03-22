import { Injectable, forwardRef, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserModel } from '../users/models/users.model';
import { AuthDto } from './dto/auth.dto';
import { USER_NOT_FOUND_ERROR, USER_WRONG_PASS_ERROR } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    // @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateJwtPayload(payload: JwtPayload): Promise<UserModel | undefined> {
    const user = await this.usersService.findOneByNickname(payload.nickname);

    if (user?.enabled) {
      user.lastSeenAt = new Date();
      // user.save();
      return user;
    }
  }

  createJwt(user: any): { data: JwtPayload; token: string } {
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

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    // const newUser = new this.userModel({
    //   email: dto.login,
    //   passwordHash: await hash(dto.password, salt)
    // });

    // return newUser.save();
  }

  async findUser(email: string) {
    // return this.userModel.findOne({ email }).exec();
    return { passwordHash: '', email: '' };
  }

  async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(USER_WRONG_PASS_ERROR);
    }

    return { email: user.email };
  }

  async login(email: string) {
    return {
      access_token: await this.jwtService.signAsync({ email })
    };
  }
}
