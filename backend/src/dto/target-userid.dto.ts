import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from '../validators/isObjectId.validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { isUserExist } from '../validators/isUserExist.validator';

export class TargetUseridDto {

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => Types.ObjectId(item.value))
    @ApiProperty({type: String, required: true})
    @isUserExist()
    public targetUserId: Types.ObjectId;

}
