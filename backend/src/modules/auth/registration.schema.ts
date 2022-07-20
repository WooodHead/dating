import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GenderEnum, UserPreferenceEnum } from '../users/user-profile/enums/userProfile.enum';

export type RegistrationDocument = Registration & Document;

@Schema({timestamps: true})
export class Registration {

    @Prop({required: true, unique: true, type: String})
    email: string;

    @Prop({required: true, type: String})
    password: string;

    @Prop({required: false, type: Number})
    phone?: number;

    @Prop({required: true, type: String})
    location: Types.ObjectId

    @Prop({required: true, type: String})
    host: string

    @Prop({required: true, type: String})
    readonly gender: GenderEnum;

    @Prop({required: true})
    readonly preference: UserPreferenceEnum;

    @Prop({required: true, type: Date})
    readonly dob: Date;

    @Prop({required: true, type: String})
    readonly name: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
