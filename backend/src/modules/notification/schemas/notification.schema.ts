import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, SchemaTimestampsConfig, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationEventTypesEnum } from '../notification.enum';

export type NotificationsDocuments = Notification & Document & SchemaTimestampsConfig;

@Schema({timestamps: true})
export class Notification {

    @Prop({required: false, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    fromUser: Types.ObjectId;

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    toUser: Types.ObjectId;

    @Prop({required: false, enum: NotificationEventTypesEnum})
    eventType: NotificationEventTypesEnum;

    @Prop({required: false, type: Object})
    additionalData: { [key: string]: any };

    @Prop({required: true, type: Boolean, default: false})
    isEmailed: boolean = false;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
