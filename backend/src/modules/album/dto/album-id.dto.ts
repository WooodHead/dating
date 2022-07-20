import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { IsObjectId } from '../../../validators/isObjectId.validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthHelpersService } from '../../helpers/auth-helpers.service';

export class AlbumIdDto {

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => AuthHelpersService.transformToObjectIdOrHttpError(item.value))
    @ApiProperty({type: String, required: true})
    public album_id: Types.ObjectId;

}
