import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { RoleModel } from './role.model';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class RoleService extends AbstractService<RoleModel> {
  constructor(@InjectModel(RoleModel) private readonly roleModel: ModelType<RoleModel>) {
    super(roleModel);
  }
}
