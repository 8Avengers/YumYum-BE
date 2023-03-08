// import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException) {
//     const status = exception.getStatus();
//     const message = exception.message;

//     console.log('===================');
//     console.log('에러가 발생했어요!!');
//     console.log('예외내용', message);
//     console.log('예외코드', status);
//     console.log('=======================================');

//     if (status === 500)
//       return new HttpException('이 에러는 서버문제입니다.!', 500);
//   }
// }

// TODO: 학습이 필요한 코드입니다. 이 코드는 무슨 뜻일까?

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        ...error,
      });
    }
  }
}