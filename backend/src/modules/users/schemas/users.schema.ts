import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DeactivateReasonsEnum } from '../enums/user.enum';
import { Expose } from 'class-transformer';

export type UsersDocuments = User & Document;

@Schema({timestamps: true})
export class User {

    @Prop({required: true, unique: true})
    @ApiProperty({type: String, uniqueItems: true})
    @Expose() email: string;

    @Prop({required: true})
    @ApiProperty({type: String, default: 'admin'})
    password: string;

    @Prop({required: false, type: Number})
    @ApiProperty({required: false, type: Number})
    @Expose() phone?: number;

    @Prop({type: Types.ObjectId, ref: 'UserProfile'})
    @ApiProperty({type: {type: Types.ObjectId, ref: 'UserProfile'}})
    @Expose() profile?: Types.ObjectId;

    @Prop({required: false, default: true, type: Boolean})
    @ApiProperty({type: Boolean})
    @Expose() isFirstLogin?: boolean;

    @Prop({required: false, default: false})
    @ApiProperty({type: Boolean, description: 'is email confirmed'})
    @Expose() isConfirmed?: boolean;

    @Prop({required: false, default: true})
    @ApiProperty({type: Boolean})
    @Expose() isActive?: boolean;

    @Prop({required: false, enum: DeactivateReasonsEnum, default: undefined})
    @ApiProperty({type: String, enum: DeactivateReasonsEnum})
    @Expose() deactivateReason?: string;

    @Prop({required: false, type: String, default: undefined})
    @Expose() socketId?: string

    @Prop({required: true, type: String, default: undefined})
    @Expose() host: string
}

export const UserSchema = SchemaFactory.createForClass(User);
