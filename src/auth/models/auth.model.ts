import { prop } from '@typegoose/typegoose';

export class LoginResult {
  @prop()
  token: string;
}

export class RefreshToken {
  @prop()
  refreshToken: string;
}

export class LoginUserInput {
  @prop()
  nickname: string;

  @prop()
  email: string;

  @prop()
  password: string;
}
