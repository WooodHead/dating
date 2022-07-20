import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type LocationDocuments = Location & Document;

@Schema()
export class Location {

  @Prop({type: Object, required: true, immutable: true})
  country: ICountry;

  @Prop({type: String, required: true, immutable: true})
  cityName: string

  @Prop({type:  Object, required: true})
  location: Place;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
LocationSchema.index({location: '2dsphere'});

export interface ICountry {

  name: string;

  iso_code: string;

  pathToFlag: string;
}

export type Place = {

  type: string;

  coordinates: [number, number];
}

