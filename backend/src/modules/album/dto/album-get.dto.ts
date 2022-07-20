import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsObjectId } from '../../../validators/isObjectId.validator';

export class AlbumGetParamsDto {

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => Types.ObjectId(item.value))
    public user_id: Types.ObjectId;
}
