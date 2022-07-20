import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types, Schema as MSchema, SchemaTimestampsConfig} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type ChatMessageDocuments = ChatMessage & Document & SchemaTimestampsConfig;

@Schema({
  timestamps: true
})
export class ChatMessage {

  @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
  @ApiProperty({type: {type: Types.ObjectId, ref: 'User'}})
  fromUser: Types.ObjectId;

  @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
  @ApiProperty({type: {type: Types.ObjectId, ref: 'User'}})
  toUser: Types.ObjectId;

  @Prop({required: true, immutable: true})
  @ApiProperty({type: String})
  chatLink: string;

  @Prop({required: true})
  @ApiProperty({type: String})
  message: string;

  @Prop({type: Boolean,required: false, default: false})
  @ApiProperty({type: Boolean})
  isRead: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
