import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    console.log('User', user);

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return user as User;
  },
);
