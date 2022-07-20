import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, ObjectId, Types, Schema as MSchema} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {RelationsEnum} from "../enums/relations.enum";

export type RelationsDocuments = Relations & Document;

@Schema({timestamps: true})
export class Relations {

  @Prop({type: MSchema.Types.ObjectId, required: true, ref: 'User', immutable: true})
  public owner: Types.ObjectId;

  @Prop({type: MSchema.Types.ObjectId, required: true, ref: 'User', immutable: true})
  @ApiProperty({type: {type: MSchema.Types.ObjectId, ref: 'User'}})
  public target: Types.ObjectId;

  @Prop({type: String, required: true, enum: RelationsEnum})
  @ApiProperty({type: String, enum: RelationsEnum})
  public relation: string;
}

export const RelationsSchema = SchemaFactory.createForClass(Relations);
RelationsSchema.index({ owner: 1, target: 1 }, { unique: true });
