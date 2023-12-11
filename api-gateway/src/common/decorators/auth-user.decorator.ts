import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { IAuthUser } from "../interfaces/auth.interface";

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as IAuthUser;
  },
);
