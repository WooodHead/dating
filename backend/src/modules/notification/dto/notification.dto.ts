import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from '../../../validators/isObjectId.validator';

export class NotificationDto {

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => Types.ObjectId(item.value))
    @ApiProperty({type: String, required: true})
    public notificationId: Types.ObjectId;

}
