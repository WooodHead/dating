import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AlbumTypeEnum } from '../enums/album.enum';

export type AlbumDocuments = Album & Document;

@Schema({timestamps: true})
export class Album {

  @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
  @ApiProperty({type: MSchema.Types.ObjectId})
  belongTo: Types.ObjectId;

  @Prop({required: true, type: String, enum: AlbumTypeEnum})
  @ApiProperty({type: String, enum: AlbumTypeEnum})
  type: string;

  @Prop({required: true, type: String})
  @ApiProperty({type: String})
  name: string;

  @Prop({required: false, type: [MSchema.Types.ObjectId], ref: 'Photo'})
  @ApiProperty({type: [MSchema.Types.ObjectId]})
  photos: Types.ObjectId[];

  @Prop({required: false, type: String})
  @ApiProperty({type: String, description: 'Title photo'})
  titlePhoto: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
