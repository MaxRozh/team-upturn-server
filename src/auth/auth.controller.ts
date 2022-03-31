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

import { RegistrationDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ACCESS_TOKEN, ALREADY_REGISTER_ERROR } from './auth.constants';
import { UserDecorator } from '../decorators/user.decorator';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: RegistrationDto) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(ALREADY_REGISTER_ERROR);
    }

    return this.usersService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { email } = await this.authService.validateUser(dto.email, dto.password);
    const loginRes = await this.authService.login(email);

    res.cookie(ACCESS_TOKEN, loginRes[ACCESS_TOKEN], {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      domain: 'team-upturn.local'
    });
    return { message: 'success' };
  }

  @Get('current_user')
  async getCurrentUser(@Req() req: Request) {
    const accessToken = req.cookies[ACCESS_TOKEN];
    const data = await this.jwtService.verifyAsync(accessToken);

    return await this.usersService.findOneById(data.id);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN);
    return { message: 'success' };
  }
}
