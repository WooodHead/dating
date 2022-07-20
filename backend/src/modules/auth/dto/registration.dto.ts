import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DateValidator } from '../../../validators/date.validator';
import { GenderEnum, UserPreferenceEnum } from '../../users/user-profile/enums/userProfile.enum';
import { EmailNotExistInDB } from '../../../validators/emailNotExistInDB.validator';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { IsObjectId } from '../../../validators/isObjectId.validator';
import { AuthHelpersService } from '../../helpers/auth-helpers.service';

export class RegistrationDto {

    @IsString({message: 'Should be string'})
    @IsEnum(GenderEnum, {message: `Should be one of this ${Object.values(GenderEnum)}`})
    @ApiProperty({type: String, enum: GenderEnum})
    readonly gender: GenderEnum;

    @IsString()
    @IsEnum(UserPreferenceEnum, {message: `preference should be one of this ${Object.values(UserPreferenceEnum)}`})
    @ApiProperty({type: String, enum: UserPreferenceEnum})
    readonly preference: UserPreferenceEnum;

    @ApiProperty({type: Date, format: 'DD-MM-Y'})
    @Transform((date) =>
            moment(date.value, 'DD-MM-YYYY', true).toDate(),
        {toClassOnly: true}
    )
    @DateValidator()
    readonly dob: Date;

    @IsString({message: 'Should be string'})
    @IsNotEmpty({message: 'Required'})
    @ApiProperty({type: String})
    readonly name: string;

    @IsEmail({}, {message: 'Incorrect email'})
    @IsNotEmpty({message: 'Required'})
    @EmailNotExistInDB()
    @ApiProperty({type: 'string'})
    readonly email: string;

    @ApiProperty({type: String, minimum: 4, maximum: 20})
    @MinLength(4, {message: 'Should be more then 4'})
    @MaxLength(20, {message: 'Should be less then 20'})
    @IsNotEmpty({message: 'Required'})
    @IsString({message: 'Should be string'})
    readonly password: string;

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => AuthHelpersService.transformToObjectIdOrHttpError(item.value))
    @ApiProperty({type: String, description: 'location id', required: true})
    readonly location;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({required: false, type: Number})
    readonly phone?: number;
}
