import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { TokenTypeEnum } from '../enums/tokenTypes.enum';


export type TokenDocuments = Token & Document;

@Schema()
export class Token {

  @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User'})
  user: Types.ObjectId;

  @Prop({required: true, type: String})
  fingerprint: string;

  @Prop({required: false, type: String})
  email?: string;

  @Prop({required: true, type: String, enum: TokenTypeEnum})
  type: TokenTypeEnum;

  @Prop({required: false, type: Number})
  init_at: number;

  @Prop({required: false, type: Number})
  expired_at: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
