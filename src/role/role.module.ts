import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleModel } from './role.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleModel,
        schemaOptions: {
          collection: 'Roles'
        }
      }
    ])
  ],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
