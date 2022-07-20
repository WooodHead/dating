import {IsNotEmpty} from "class-validator";
import {IsObjectId} from "../../../validators/isObjectId.validator";
import {ApiProperty} from "@nestjs/swagger";
import {ObjectId} from "mongoose";

export class PhotoIdDto {
    @IsNotEmpty()
    @IsObjectId()
    @ApiProperty({type: String, required: false})
    public readonly photoId: ObjectId;
}
