import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
  // if (configService.mongoAuthEnabled) {
  //   options.user = configService.mongoUser;
  //   options.pass = configService.mongoPassword;
  // }

  return {
    // uri: getMongoString(configService),
    uri: configService.get('MONGO_URI'),
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
};

// const getMongoString = (configService: ConfigService) =>
//   'mongodb://' +
//   configService.get('MONGO_LOGIN') +
//   ':' +
//   configService.get('MONGO_PASSWORD') +
//   '@' +
//   configService.get('MONGO_HOST') +
//   ':' +
//   configService.get('MONGO_PORT') +
//   '/' +
//   configService.get('MONGO_AUTHDATABASE');
