import { SocketSchema, Socket as SocketModel } from './models/sockets.model';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChatBackEndGateway } from './chatBackEnd.gateway';
import { ChatRoomService } from './chatRoom.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: SocketModel.name, schema: SocketSchema },
    ]),
  ],
  providers: [ChatBackEndGateway, ChatRoomService],
})
export class ChatBackEndModule {}
