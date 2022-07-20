import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type CountriesDocuments = Countries & Document;

@Schema()
export class Countries {

  @Prop({required: true, unique: true})
  name: string;

  @Prop({required: true})
  iso_code: string;

  @Prop({required: true})
  filepath: string;
}

export const CountriesSchema = SchemaFactory.createForClass(Countries);