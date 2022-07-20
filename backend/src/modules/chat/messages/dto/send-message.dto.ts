import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { isUserExist } from '../../../../validators/isUserExist.validator';
import { IsObjectId } from '../../../../validators/isObjectId.validator';
import { Transform } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export class SendMessageDto {

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => {
        try {
            return Types.ObjectId(item.value);
        } catch (e) {
            throw new HttpException('incorrect targetId', HttpStatus.BAD_REQUEST)
        }
    })
    @ApiProperty({type: String, required: true})
    @isUserExist()
    public targetUserId: Types.ObjectId;

    @IsNotEmpty({message: 'Required'})
    @ApiProperty({type: String, required: true})
    readonly message: string;
}
