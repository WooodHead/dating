import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type LanguagesDocuments = Languages & Document;

@Schema()
export class Languages {

  @Prop({required: true, unique: true})
  name: string;
}

export const LanguagesSchema = SchemaFactory.createForClass(Languages);