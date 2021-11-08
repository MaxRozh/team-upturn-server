import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

// import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
// import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// @Controller()
// export class AppController {
//   constructor(private readonly authService: AuthService, private readonly appService: AppService) {}
//
//   @UseGuards(LocalAuthGuard)
//   @Post('auth/login')
//   async login(@Request() req) {
//     return this.authService.login(req.user);
//   }
//
//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Request() req) {
//     return req.user;
//   }
//
//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
