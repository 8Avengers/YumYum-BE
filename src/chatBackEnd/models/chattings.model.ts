import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { Socket as SocketModel } from './sockets.model';

//@@ 채팅방 내용을 DB에 저장하기기록하기 위한 모델

const options: SchemaOptions = {
  collection: 'chattings', //db이름을 설정
  timestamps: true,
};

@Schema(options)
export class Chatting extends Document {
  // @Prop({
  //   type: {
  //     _id: { type: Types.ObjectId, required: false, ref: 'sockets' },
  //     id: { type: String },
  //     username: { type: String, required: false },
  //   },
  // })
  @Prop({ required: true })
  @IsString()
  // @IsNotEmpty()
  nickname: string;
  // nickname: SocketModel;

  @Prop({
    required: false,
  })
  // @IsNotEmpty()
  @IsString()
  message: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
