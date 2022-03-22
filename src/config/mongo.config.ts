import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
  // `mongodb://${url}:27017?serverSelectionTimeoutMS=2000&authSource=admin`
  // mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin

  // if (configService.mongoAuthEnabled) {
  //   options.user = configService.mongoUser;
  //   options.pass = configService.mongoPassword;
  // }

  return {
    // uri: getMongoString(configService),
    uri: configService.get('MONGO_URI'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
