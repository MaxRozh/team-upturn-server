import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { CatsModule } from './cats/cats.module';
// import { RecipesModule } from './recipes/recipes.module';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: MongooseModuleOptions = {
          uri: configService.mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };

        if (configService.mongoAuthEnabled) {
          options.user = configService.mongoUser;
          options.pass = configService.mongoPassword;
        }

        return options;
      },
      inject: [ConfigService],
    }),
    // @ts-ignore
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql'
    }),
    UsersModule,
    AuthModule,
    ConfigModule,
    // RecipesModule,
    // CatsModule,
    // AuthModule,
    // UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
