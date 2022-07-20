import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type NationalityDocuments = Nationality & Document;

@Schema()
export class Nationality {

  @Prop({required: true, unique: true})
  name: string;
}

export const NationalitySchema = SchemaFactory.createForClass(Nationality);