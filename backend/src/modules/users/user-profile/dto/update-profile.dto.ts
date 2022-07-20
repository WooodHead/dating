import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DateValidator } from '../../../../validators/date.validator';
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
    StatusEnum,
    UserPreferenceEnum
} from '../enums/userProfile.enum';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { IsObjectId } from '../../../../validators/isObjectId.validator';
import { Types } from 'mongoose';
import { AuthHelpersService } from '../../../helpers/auth-helpers.service';

export class UpdateProfileDto {

    @IsOptional()
    @IsEnum(GenderEnum, {message: `Should be one of this ${Object.values(GenderEnum)}`})
    @ApiProperty({type: String, enum: GenderEnum, required: false})
    readonly gender?: string;

    @IsOptional()
    @ApiProperty({type: Date, format: 'DD-MM-Y', required: false})
    @IsNotEmpty({message: 'Required'})
    @Transform((date) =>
            moment(date.value, 'DD-MM-YYYY', true).toDate(),
        {toClassOnly: true}
    )
    @DateValidator()
    readonly dob?: Date;

    @IsOptional()
    @IsString()
    @IsEnum(UserPreferenceEnum, {message: `preference should be one of this ${Object.values(UserPreferenceEnum)}`})
    @ApiProperty({type: String, enum: UserPreferenceEnum, required: false})
    readonly preference?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({type: String, required: false})
    readonly name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({type: String, required: false})
    readonly bio?;

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => Types.ObjectId(item.value))
    @ApiProperty({type: String, description: 'location id', required: true})
    readonly location;

    @IsOptional()
    @IsArray()
    @Transform((items) => items.value.map(item => AuthHelpersService.transformToObjectIdOrHttpError(item)))
    @ApiProperty({type: [String], description: 'languages id', required: false})
    readonly languages?: Types.ObjectId[];

    @IsOptional()
    @IsObjectId()
    @Transform((item) => AuthHelpersService.transformToObjectIdOrHttpError(item.value))
    @ApiProperty({type: String, description: 'nationality id', required: false})
    readonly nationality?;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({type: Number, required: false})
    readonly weight?: number;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({type: Number, required: false})
    readonly height?: number;

    @IsOptional()
    @IsEnum(EthnicEnum, {

            always: false,
            message: `Should be one of this ${Object.values(EthnicEnum)}`
        }
    )
    @ApiProperty({type: String, enum: EthnicEnum, required: false})
    readonly ethnic?;

    @IsOptional()
    @IsEnum(SmokeEnum, {message: `Should be one of this ${Object.values(SmokeEnum)}`})
    @ApiProperty({type: String, enum: SmokeEnum, required: false})
    readonly smoker?;

    @IsOptional()
    @IsEnum(DietTypeEnum, {message: `Should be one of this ${Object.values(DietTypeEnum)}`})
    @ApiProperty({type: String, enum: DietTypeEnum, required: false})
    readonly diet?;

    @IsOptional()
    @IsEnum(ProfessionalEnum, {message: `Should be one of this ${Object.values(ProfessionalEnum)}`})
    @ApiProperty({type: String, enum: ProfessionalEnum, required: false})
    readonly professional?;

    @IsOptional()
    @IsEnum(BodyTypeEnum, {message: `Should be one of this ${Object.values(BodyTypeEnum)}`})
    @ApiProperty({type: String, enum: BodyTypeEnum, required: false})
    readonly bodyType?;

    @IsOptional()
    @IsEnum(HairTypeEnum, {message: `Should be one of this ${Object.values(HairTypeEnum)}`})
    @ApiProperty({type: String, enum: HairTypeEnum, required: false})
    readonly hairType?;

    @IsOptional()
    @IsEnum(HairEnum, {message: `Should be one of this ${Object.values(HairEnum)}`})
    @ApiProperty({type: String, enum: HairEnum, required: false})
    readonly hair?;

    @IsOptional()
    @IsEnum(EyesEnum, {message: `Should be one of this ${Object.values(EyesEnum)}`})
    @ApiProperty({type: String, enum: EyesEnum, required: false})
    readonly eyes?;

    @IsOptional()
    @IsEnum(AlcoholEnum, {message: `Should be one of this ${Object.values(AlcoholEnum)}`})
    @ApiProperty({type: String, enum: AlcoholEnum, required: false})
    readonly alcohol?;

    @IsOptional()
    @IsEnum(StatusEnum, {message: `Should be one of this ${Object.values(StatusEnum)}`})
    @ApiProperty({type: String, enum: StatusEnum, required: false})
    readonly status?;

    @IsOptional()
    @ApiProperty({type: String, required: false})
    readonly avatarPath?: string;

    @IsOptional()
    @ApiProperty({type: String, required: false})
    readonly smAvatarPath?: string;

    @IsOptional()
    @ApiProperty({type: String, required: false})
    readonly originalAvatarPath?: string;
}
