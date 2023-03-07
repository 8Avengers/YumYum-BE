import { Controller, Get, Render, Res } from '@nestjs/common';

@Controller()
export class ChatFrontEndController {
  @Get()
  @Render('index')
  root(@Res() response: Response) {
    return { message: 'Hello world!' };
  }
}
