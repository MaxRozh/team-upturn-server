import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ALREADY_REGISTER_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const existingUser = await this.usersService.findOneByEmail(dto.login);

    if (existingUser) {
      throw new BadRequestException(ALREADY_REGISTER_ERROR);
    }

    return this.usersService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const { email } = await this.authService.validateUser(dto.login, dto.password);
    return this.authService.login(email);
  }
}
