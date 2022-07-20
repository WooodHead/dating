import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Factory } from 'nestjs-seeder';
import * as moment from 'moment';
import {
    AlcoholEnum,
    BodyTypeEnum,
    DietTypeEnum,
    EthnicEnum,
    EyesEnum,
    GenderEnum,
    HairEnum,
    HairTypeEnum,
    ProfessionalEnum,
    SmokeEnum,
    StatusEnum, UserPreferenceEnum,
} from '../enums/userProfile.enum';
import { Expose, Type } from 'class-transformer';
import { Place } from '../../../addition-data/schemas/location.schema';

export type UserProfileDocuments = UserProfile & Document;

@Schema({timestamps: true})
export class UserProfile {

    @Prop({required: true})
    @Factory(faker => faker.name.findName())
    @ApiProperty({type: String})
    @Expose() name: string;

    @Prop({type: Date, required: true})
    @Factory(faker => moment(faker.date.between('1970', '2000'), 'faker').toDate())
    @ApiProperty({type: String, description: 'Date of birth'})
    @Expose() dob: Date;

    @Prop({required: true, enum: GenderEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(GenderEnum)))
    @ApiProperty({type: String, enum: GenderEnum})
    @Expose() gender: string;

    @Prop({required: false, enum: UserPreferenceEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(UserPreferenceEnum)))
    @ApiProperty({type: String, enum: UserPreferenceEnum})
    @Expose() preference: string;

    @Prop({required: false})
    @Factory(faker => faker.lorem.sentences())
    @ApiProperty({type: String, description: 'information about user'})
    @Expose() bio?: string;

    @Prop({required: false})
    @Factory((faker, ctx: { imgPath: string }) => ctx.imgPath)
    @ApiProperty({type: String, description: 'path to avatar img'})
    @Expose() avatarPath?: string;

    @Prop({required: false})
    @Factory((faker, ctx: { imgPath: string }) => ctx.imgPath)
    @ApiProperty({type: String})
    @Expose() smAvatarPath?: string;

    @Prop({required: false})
    @Factory((faker, ctx: { imgPath: string }) => ctx.imgPath)
    @ApiProperty({type: String})
    @Expose() originalAvatarPath?: string;

    @Prop({required: false, enum: StatusEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(StatusEnum)))
    @ApiProperty({type: String, enum: StatusEnum})
    @Expose() status?: string;

    @Prop({required: false, enum: HairEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(HairEnum)))
    @ApiProperty({type: 'enum', enum: HairEnum})
    @Expose() hair?: string;

    @Prop({required: false, enum: HairTypeEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(HairTypeEnum)))
    @ApiProperty({type: String, enum: HairTypeEnum})
    @Expose() hairType?: string;

    @Prop({required: false})
    @Factory(faker => faker.random.number(140, 200))
    @ApiProperty({type: Number})
    @Expose() height?: Number;

    @Prop({required: false})
    @Factory(faker => faker.random.number(50, 150))
    @ApiProperty({type: Number})
    @Expose() weight?: Number;

    @Prop({required: false, enum: EyesEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(EyesEnum)))
    @ApiProperty({type: String, enum: EyesEnum})
    @Expose() eyes?: string;

    @Prop({required: false, enum: AlcoholEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(AlcoholEnum)))
    @ApiProperty({type: String, enum: AlcoholEnum})
    @Expose() alcohol?: string;

    @Prop({required: false, enum: BodyTypeEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(BodyTypeEnum)))
    @ApiProperty({type: String, enum: BodyTypeEnum})
    @Expose() bodyType?: string;

    @Prop({required: false, enum: ProfessionalEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(ProfessionalEnum)))
    @ApiProperty({type: String, enum: ProfessionalEnum})
    @Expose() professional?: string;

    @Prop({required: false, enum: DietTypeEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(DietTypeEnum)))
    @ApiProperty({type: String, enum: DietTypeEnum})
    @Expose() diet?: string;

    @Prop({required: false, enum: SmokeEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(SmokeEnum)))
    @ApiProperty({type: String, enum: SmokeEnum})
    @Expose() smoker?: string;

    @Prop({type: MSchema.Types.ObjectId, ref: 'Nationality'})
    @Factory((faker, ctx: { nation: string }) => ctx.nation)
    @ApiProperty({type: MSchema.Types.ObjectId})
    @Expose() nationality?: Types.ObjectId;

    @Prop({type: [MSchema.Types.ObjectId], ref: 'Languages'})
    @Factory((faker, ctx: { language: string }) => [ctx.language])
    @ApiProperty({type: [MSchema.Types.ObjectId], description: 'array of languages ids'})
    @Expose() languages?: Types.ObjectId[];

    @Prop({required: false, enum: EthnicEnum})
    @Factory(faker => faker.random.arrayElement(Object.values(EthnicEnum)))
    @ApiProperty({type: String, enum: EthnicEnum})
    @Expose() ethnic?: string;

    @Prop({type: MSchema.Types.ObjectId, ref: 'Location', required: true})
    @Factory((faker, ctx: { locations: ObjectId }) => ctx.locations)
    @ApiProperty({type: {type: Types.ObjectId, ref: 'Location'}, required: true})
    @Expose() location: Types.ObjectId;

    @Prop({type:  Object, required: false})
    @Expose() place?: Place;

    @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @Factory((faker, ctx: { userId: ObjectId }) => ctx.userId)
    @ApiProperty({type: {type: MSchema.Types.ObjectId, ref: 'User'}})
    @Expose() user?: Types.ObjectId;

    @Prop({type: Boolean, default: false})
    @Factory(faker => faker.random.arrayElement([true, false]))

    @Type(() => Boolean)
    @ApiProperty({type: Boolean})
    @Expose() online?: boolean;

    @Type(() => Boolean)
    @Prop({type: Boolean, default: false})
    @ApiProperty({type: Boolean, default: false})
    @Expose() isBoot?: boolean;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
UserProfileSchema.index({gender: 1})
UserProfileSchema.index( { place: "2dsphere" } )

