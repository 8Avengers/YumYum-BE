import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

//@@ Socket => DM으로 생각하면 됨
//@@ 채팅방에서 ID와 USERNAME을 저장하기 위한 콜렉션

const options: SchemaOptions = {
  id: true, // false일시 chattings.model.ts에서 _id와 id를 분리해서 사용가능하게 함
  collection: 'sockets',
  timestamps: true,
};

@Schema(options)
export class Socket extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;
}

export const SocketSchema = SchemaFactory.createForClass(Socket);
