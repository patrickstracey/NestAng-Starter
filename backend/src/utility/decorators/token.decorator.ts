import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const TokenData = createParamDecorator((data, context: ExecutionContext): {} => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
