import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LikeTypeEnum } from '../like.enum';

export class TypeLikeDto {

    @IsNotEmpty()
    @IsEnum(LikeTypeEnum, {message: `Should be one of this ${Object.values(LikeTypeEnum)}`})
    @ApiProperty({
        type: String,
        enum: LikeTypeEnum,
        required: true
    })
    public readonly likeType: LikeTypeEnum;

}
