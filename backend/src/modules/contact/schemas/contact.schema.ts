import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ContactStatusesEnum } from '../enums/contact.enum';

export type ContactDocuments = Contact & Document;

@Schema({timestamps: true})
export class Contact {

  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  email: string;

  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  firstName: string;

  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  lastName: string;

  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  message: string;

  @Prop({required: true, type: String})
  @ApiProperty({type: String, required: true})
  domain: string;

  @Prop({required: false, enum: ContactStatusesEnum, default: ContactStatusesEnum.receiveFromUser})
  @ApiProperty({type: String, enum: ContactStatusesEnum})
  status?: ContactStatusesEnum;

  @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true, required: false})
  @ApiProperty({type: {type: MSchema.Types.ObjectId, ref: 'User'}})
  user?: Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
