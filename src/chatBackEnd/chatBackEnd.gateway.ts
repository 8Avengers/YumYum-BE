import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chatRoom.service';
import { setInitDTO, chatRoomListDTO } from './dto/chatBackEnd.dto';
import { Observable, map, from } from 'rxjs';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chatting } from './models/chattings.model';
import { Model } from 'mongoose';
import { Socket as SocketModel } from './models/sockets.model';

@WebSocketGateway(5000, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
//OnGatewayDisconnect
export class ChatBackEndGateway implements OnGatewayConnection {
  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
    private readonly ChatRoomService: ChatRoomService,
  ) {}
  @WebSocketServer()
  server: Server;
  //메시지가 전송되면 모든 유저에게 메시지 전송 및 기록
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ): Promise<void> {
    // 메시지 전송하면 바로 DB저장
    const socketObj = await this.socketModel.findOne({ id: client.id });

    await this.chattingModel.create({
      nickname: client.data.nickname,
      message,
    });

    console.log();

    client.rooms.forEach((roomId) =>
      client.to(roomId).emit('getMessage', {
        id: client.id,
        nickname: client.data.nickname,
        message,
      }),
    );
  }

  //🔥소켓 연결시 유저목록에 추가 => 데이터에 저장된 채팅방 목록 보여주기🔥
  public async handleConnection(
    @ConnectedSocket() client: Socket,
    nickname: Chatting,
  ): Promise<void> {
    const chatRoom = await this.chattingModel.findOne({ nickname });
    // const { roomId } = client.data;
    console.log('타입체크 =', typeof chatRoom);
    console.log('JSON =', JSON.stringify(chatRoom));
    console.log(client.data.nickname);

    //     @Injectable()
    // export class UserService {
    //   constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    //   async findAll(): Promise<User[]> {
    //     return this.userModel.find().exec();
    //   }
    // }

    // console.log('connected', client.id);
    // client.leave(client.id);
    // client.data.roomId = `room:lobby`;
    // client.join('room:lobby');
  }

  //소켓 연결 해제시 유저목록에서 제거
  // public handleDisconnect(client: Socket): void {
  //   const { roomId } = client.data;
  //   if (
  //     roomId != 'room:lobby' &&
  //     !this.server.sockets.adapter.rooms.get(roomId)
  //   ) {
  //     this.ChatRoomService.deleteChatRoom(roomId);
  //     this.server.emit(
  //       'getChatRoomList',
  //       this.ChatRoomService.getChatRoomList(),
  //     );
  //   }
  //   console.log('disonnected', client.id);
  // }

  //처음 접속시 닉네임 등 최초 설정
  @SubscribeMessage('setInit')
  setInit(client: Socket, data: setInitDTO): setInitDTO {
    // 이미 최초 세팅이 되어있는 경우 패스
    if (client.data.isInit) {
      return;
    }

    client.data.nickname = data.nickname
      ? data.nickname
      : '낯선사람' + client.id;

    client.data.isInit = true;

    return {
      nickname: client.data.nickname,
      room: {
        roomId: 'room:lobby',
        roomName: '로비',
      },
    };
  }

  //닉네임 변경
  @SubscribeMessage('setNickname')
  setNickname(client: Socket, nickname: string): void {
    const { roomId } = client.data;
    client.to(roomId).emit('getMessage', {
      id: null,
      nickname: '안내',
      message: `"${client.data.nickname}"님이 "${nickname}"으로 닉네임을 변경하셨습니다.`,
    });
    client.data.nickname = nickname;
  }

  //채팅방 목록 가져오기 =>
  @SubscribeMessage('getChatRoomList')
  getChatRoomList(client: Socket, payload: any) {
    client.emit('getChatRoomList', this.ChatRoomService.getChatRoomList());
  }

  //채팅방 생성하기
  @SubscribeMessage('createChatRoom')
  createChatRoom(client: Socket, roomName: string) {
    //이전 방이 만약 나 혼자있던 방이면 제거
    // if (
    //   client.data.roomId != 'room:lobby' &&
    //   this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    // ) {
    //   this.ChatRoomService.deleteChatRoom(client.data.roomId);
    // }

    this.ChatRoomService.createChatRoom(client, roomName);
    return {
      roomId: client.data.roomId,
      roomName: this.ChatRoomService.getChatRoom(client.data.roomId).roomName,
    };
  }

  //🔥채팅방 들어가기 => 채팅방 들어가면 채팅 목록 가져오기 기능🔥
  @SubscribeMessage('enterChatRoom')
  enterChatRoom(client: Socket, roomId: string) {
    //이미 접속해있는 방 일 경우 재접속 차단
    if (client.rooms.has(roomId)) {
      return;
    }
    //이전 방이 만약 나 혼자있던 방이면 제거
    // if (
    //   client.data.roomId != 'room:lobby' &&
    //   this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    // ) {
    //   this.ChatRoomService.deleteChatRoom(client.data.roomId);
    // }
    this.ChatRoomService.enterChatRoom(client, roomId);
    return {
      roomId: roomId,
      roomName: this.ChatRoomService.getChatRoom(roomId).roomName,
    };
  }
}
