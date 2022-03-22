export interface JwtPayload {
  email: string;
  nickname: string;
  expiration?: Date;
}
