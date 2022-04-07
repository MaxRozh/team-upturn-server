import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

import { RegistrationDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ACCESS_TOKEN, ALREADY_REGISTER_ERROR } from './auth.constants';
import { UserDecorator } from '../decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: RegistrationDto, @Res({ passthrough: true }) res: Response) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(ALREADY_REGISTER_ERROR);
    }

    const user = await this.usersService.create(dto);
    const loginRes = await this.authService.login(user._id.toString());

    res.cookie(ACCESS_TOKEN, loginRes[ACCESS_TOKEN], {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      domain: this.configService.get('CLIENT_DOMAIN')
    });
    return { message: 'success' };
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { id } = await this.authService.validateUser(dto.email, dto.password);
    const loginResult = await this.authService.login(id);

    res.cookie(ACCESS_TOKEN, loginResult[ACCESS_TOKEN], {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      domain: this.configService.get('CLIENT_DOMAIN')
    });
    return { message: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current_user')
  async getCurrentUser(@Req() req: Request) {
    const accessToken = req.cookies[ACCESS_TOKEN];
    const data = await this.jwtService.verifyAsync(accessToken);
    const user = await this.usersService.findOneById(data.id);

    return {
      id: user._id,
      name: user.name,
      position: user.position,
      avatar: user.avatar
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN, { httpOnly: true, domain: this.configService.get('CLIENT_DOMAIN') });
    return { message: 'success' };
  }
}
