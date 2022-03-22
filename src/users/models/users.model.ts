import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

class PasswordReset {
  @prop()
  token: string;

  @prop()
  expiration: Date;
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  nickname: string;

  @prop({ required: true })
  email: string;

  @prop({ type: () => String })
  permissions: string[];

  @prop()
  lastSeenAt: Date;

  @prop({ default: false })
  enabled: boolean;

  @prop({ required: true })
  passwordHash: string;

  // @prop()
  // company: string;

  @prop()
  role: string;

  @prop()
  avatar: string;

  @prop({ type: () => PasswordReset })
  passwordReset: PasswordReset;

  // @prop()
  // team: string;

  // @prop()
  // workPath: string[];
}

export class CreateUserInput {
  @prop()
  nickname: string;

  @prop()
  email: string;

  @prop()
  passwordHash: string;
}

export class UpdatePasswordInput {
  @prop()
  oldPassword: string;

  @prop()
  newPassword: string;
}

export class UpdateUserInput {
  @prop()
  nickname: string;

  @prop()
  email: string;

  @prop()
  passwordHash: UpdatePasswordInput;
}
