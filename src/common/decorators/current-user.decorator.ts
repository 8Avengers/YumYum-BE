// import { User } from 'src/apis/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//User 엔티티를 쓰면, DB에 들어가서 찾아오는 것일까요?

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    // console.log('::::::data찍어보자::::::', data);
    // console.log('::::::context찍어보자::::::', context);
    const req = context.switchToHttp().getRequest();
    console.log(':::::현재유저는 누구일까? req.user:::::', req.user);

    return req.user;
  },
);