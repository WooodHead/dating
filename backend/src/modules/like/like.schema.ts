import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, SchemaTimestampsConfig, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { LikeTargetObjectEnum, LikeTypeEnum } from './like.enum';

export type LikeDocuments = Like & Document & SchemaTimestampsConfig;

@Schema({timestamps: true})

export class Like {

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    public readonly ownerId: Types.ObjectId;

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    public readonly targetId: Types.ObjectId;

    @Prop({required: false, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    public readonly photoId?: Types.ObjectId;

    @Prop({required: true, enum: LikeTypeEnum})
    @ApiProperty({type: LikeTypeEnum, enum: LikeTypeEnum})
    public readonly type: LikeTypeEnum;

    @Prop({required: true, enum: LikeTargetObjectEnum})
    @ApiProperty({type: LikeTargetObjectEnum, enum: LikeTargetObjectEnum})
    public readonly object: LikeTargetObjectEnum;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
