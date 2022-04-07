import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext): any => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  return user;
});
