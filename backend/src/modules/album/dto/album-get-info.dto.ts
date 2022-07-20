import {IsNotEmpty} from "class-validator";
import {Transform} from "class-transformer";
import {Types} from "mongoose";
import {IsObjectId} from "../../../validators/isObjectId.validator";

export class AlbumGetInfoDto {

    @IsNotEmpty()
    @IsObjectId()
    @Transform((item) => Types.ObjectId(item.value))
    public album_id: Types.ObjectId;

}
