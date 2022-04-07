import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { createTransport, SendMailOptions } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcrypt';

import { UserModel } from './models/users.model';
import { AuthService } from '../auth/auth.service';
import { RegistrationDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  isAdmin(permissions: string[]): boolean {
    return permissions.includes('admin');
  }

  async addPermission(permission: string, nickname: string): Promise<UserModel | undefined> {
    const user = await this.findOneByNickname(nickname);

    if (!user) return undefined;
    if (user.permissions.includes(permission)) return user;

    user.permissions.push(permission);
    await user.save();

    return user;
  }

  async removePermission(permission: string, nickname: string): Promise<UserModel | undefined> {
    const user = await this.findOneByNickname(nickname);

    if (!user) return undefined;

    user.permissions = user.permissions.filter((userPermission) => userPermission !== permission);
    await user.save();

    return user;
  }

  async update(id: string, fieldsToUpdate: UpdateUserDto): Promise<any> {
    const currentUser = await this.findOneById(id);
    const errors = [];

    if (!currentUser) {
      throw new BadRequestException('user not found');
    }

    if (fieldsToUpdate.nickname && currentUser.nickname !== fieldsToUpdate.nickname) {
      const duplicateUser = await this.findOneByNickname(fieldsToUpdate.nickname);
      if (duplicateUser) {
        errors.push('nickname already taken');
      }
    }

    if (fieldsToUpdate.email && currentUser.email !== fieldsToUpdate.email) {
      const duplicateUser = await this.findOneByEmail(fieldsToUpdate.email);
      if (duplicateUser) {
        errors.push('email already taken');
      }
    }

    return this.userModel.updateOne({ id }, { $set: fieldsToUpdate }, { new: true, runValidators: true });
  }

  async updateExistingUser(nickname: string, fieldsToUpdate: any): Promise<any> {
    return this.userModel.updateOne({ nickname }, { $set: fieldsToUpdate }, { new: true, runValidators: true });
  }

  async forgotPassword(email: string): Promise<boolean> {
    if (!this.configService.get('EMAIL_ENABLED')) return false;

    const user = await this.findOneByEmail(email);
    if (!user) return false;
    if (!user.enabled) return false;

    const token = randomBytes(32).toString('hex');
    const expiration = new Date(Date().valueOf() + 12 * 60 * 60 * 1000);
    const transporter = createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USERNAME'),
        pass: this.configService.get('EMAIL_PASSWORD')
      }
    });
    const mailOptions: SendMailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: `Reset Password`,
      text: `${user.nickname},
      Replace this with a website that can pass the token:
      ${token}`
    };

    return new Promise((resolve) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          resolve(false);
          return;
        }

        user.passwordReset = {
          token,
          expiration
        };

        user.save().then(
          () => resolve(true),
          () => resolve(false)
        );
      });
    });
  }

  async resetPassword(nickname: string, code: string, password: string): Promise<UserModel | undefined> {
    const user = await this.findOneByNickname(nickname);
    if (user && user.passwordReset && user.enabled !== false) {
      if (user.passwordReset.token === code) {
        user.passwordHash = password;
        user.passwordReset = undefined;
        await user.save();
        return user;
      }
    }
    return undefined;
  }

  async create(dto: RegistrationDto): Promise<UserModel> {
    const salt = await genSalt(10);
    let newUser = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
      roles: []
    });

    try {
      newUser = await newUser.save();
    } catch (error) {
      throw new BadRequestException('Not valid fields');
    }

    return newUser.save();
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) return user;
    return undefined;
  }

  async findOneByNickname(nickname: string) {
    const user = await this.userModel.findOne({ lowercaseNickname: nickname.toLowerCase() }).exec();
    if (user) return user;
    return undefined;
  }

  async findOneById(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (user) return user;
    return undefined;
  }

  async getAllUsers(limit = 16): Promise<UserModel[]> {
    return await this.userModel.find().limit(limit).exec();
  }
}
