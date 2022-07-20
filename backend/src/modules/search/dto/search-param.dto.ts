import { IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { UpdateProfileDto } from '../../users/user-profile/dto/update-profile.dto';
import { OffsetTakeDto } from '../../../dto/offset-take.dto';
import { IsObjectId } from '../../../validators/isObjectId.validator';
import { Types } from 'mongoose';

export class SearchParamDto extends IntersectionType(
    OmitType(UpdateProfileDto, [
        'dob', 'preference', 'name', 'bio', 'avatarPath', 'smAvatarPath', 'originalAvatarPath', 'location'
    ] as const),
    OffsetTakeDto
) {

    @IsOptional()
    @IsObjectId()
    @Transform((item) => Types.ObjectId(item.value))
    @ApiProperty({type: String, description: 'location id', required: false})
    readonly location?;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({type: Number, minimum: 18, maximum: 99, required: false})
    @Min(18, {message: 'Should be more then 18'})
    @Max(99, {message: 'Should be less then 99'})
    public readonly minAge?: number;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({type: Number, minimum: 18, maximum: 99, required: false})
    @Min(18, {message: 'Should be more then 18'})
    @Max(99, {message: 'Should be less then 99'})
    public readonly maxAge?: number;

    @IsOptional()
    @Transform(item => item.value == 'true')
    @ApiProperty({type: Boolean, required: false})
    public readonly isWithPhoto?: boolean;

    @IsOptional()
    @Transform(item => item.value == 'true')
    @ApiProperty({type: Boolean, required: false})
    public readonly isOnline?: boolean;

    @IsOptional()
    @Transform(item => item.value == 'true')
    @ApiProperty({type: Boolean, required: false})
    public readonly isRegisterIn15Days?: boolean;

    @IsOptional()
    @Transform(item => Number(item.value))
    @ApiProperty({type: Number, required: false, description: 'in kilometers'})
    public readonly distance?: number = 10;
}
