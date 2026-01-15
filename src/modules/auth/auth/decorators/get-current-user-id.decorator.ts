import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new UnauthorizedException('User not found in request');
    }
    
    if (!request.user.userId && !request.user.sub) {
      throw new UnauthorizedException('User ID not found in JWT payload');
    }
    
    return request.user.userId || request.user.sub;
  },
);
