import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReportsDocuments = Reports & Document;

@Schema({timestamps: true,})
export class Reports {

  @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true, unique: true})
  @ApiProperty({type: {type: Types.ObjectId, ref: 'User'}})
  user: Types.ObjectId;

  @Prop({type: [Object], default: 0})
  @ApiProperty({type: {type: [Object]}})
  reports: IReport[];

}

export const ReportsSchema = SchemaFactory.createForClass(Reports);

export interface IReport {
  complainerId: Types.ObjectId,
  reason: string
}
