import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './config/mongo.config';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    UsersModule,
    RoleModule
  ]
})
export class AppModule {}
