import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    console.log(
      ':::::::::req.user데코레이터 뭐가 들어가있나::::::::::::',
      req.user,
    );

    return req.user;
  },
);
