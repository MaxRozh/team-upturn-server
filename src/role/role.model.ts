import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

import { UserModel } from '../users/models/users.model';

export interface RoleModel extends Base {}
export class RoleModel extends TimeStamps {
  @prop({ required: true })
  name: string;

  @prop({ ref: () => UserModel, localField: '_id', foreignField: 'roles' })
  users: Ref<UserModel>[];
}
