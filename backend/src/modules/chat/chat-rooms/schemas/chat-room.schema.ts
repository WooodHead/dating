import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types, Schema as MSchema} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNotEmpty, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";

export class RoomConfig {

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Prop({type: Boolean, default: false})
  @ApiProperty({type: Boolean, default: false})
  isMute?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Prop({type: Boolean, default: false})
  @ApiProperty({type: Boolean, default: false})
  isArchived?: boolean;
}

export type ChatRoomDocuments = ChatRoom & Document;

@Schema()
export class ChatRoom {

    @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: {type: Types.ObjectId, ref: 'User'}})
    user: Types.ObjectId;

    @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: {type: Types.ObjectId, ref: 'User'}})
    toUser: Types.ObjectId;

    @Prop({required: true})
    @ApiProperty({type: String})
    chatLink: string;

    @Prop({required: true, type: RoomConfig, default: {isMute: false, isArchived: false}})
    @ApiProperty({type: RoomConfig})
    config: RoomConfig = {isMute: false, isArchived: false};

    @Prop({required: true, default: false})
    @ApiProperty({required: true, type: Boolean})
    isDelete: boolean = false;

}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

ChatRoomSchema.index({user: 1, chatLink: 1}, {unique: true})
