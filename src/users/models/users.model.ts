import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

import { RoleModel } from '../../role/role.model';

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

  @prop({ default: true })
  enabled: boolean;

  @prop()
  position: string;

  @prop({ required: true })
  passwordHash: string;

  @prop({ ref: () => RoleModel, required: true })
  roles: Ref<RoleModel>[];

  @prop()
  avatar: string;

  @prop({ type: () => PasswordReset })
  passwordReset: PasswordReset;

  // @prop()
  // company: string;

  // @prop()
  // team: string;

  // @prop()
  // workPath: string[];
}
