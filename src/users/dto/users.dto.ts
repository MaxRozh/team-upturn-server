import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  nickname?: string;

  @IsEmail()
  email?: string;

  @IsBoolean()
  enabled?: boolean;

  @IsString()
  avatar?: string;
}
