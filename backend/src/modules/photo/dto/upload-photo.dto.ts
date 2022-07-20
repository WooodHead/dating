import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";
import {ObjectId} from "mongoose";
import {IsObjectId} from "../../../validators/isObjectId.validator";

export class UploadPhotoDto {
    @IsOptional()
    @IsObjectId()
    @ApiProperty({type: String, required: false})
    public readonly albumId?: ObjectId;
}
