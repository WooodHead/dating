import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PhotoDocuments = Photo & Document;

@Schema({timestamps: true})
export class Photo {

    @Prop({required: true, type: String})
    @ApiProperty({type: String})
    photoPath: string;

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    belongTo: Types.ObjectId;

    @Prop({required: false, type: MSchema.Types.ObjectId, ref: 'Album'})
    @ApiProperty({type: [MSchema.Types.ObjectId]})
    album: Types.ObjectId | null;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
