import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwnConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get('JWT_SECRET'),
  };
};
