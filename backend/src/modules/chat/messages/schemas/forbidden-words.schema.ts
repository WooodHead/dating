import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type ForbiddenWordsDocuments = ForbiddenWords & Document;

@Schema()
export class ForbiddenWords {

  @Prop({required: true})
  word: string;
}

export const ForbiddenWordsSchema = SchemaFactory.createForClass(ForbiddenWords);
