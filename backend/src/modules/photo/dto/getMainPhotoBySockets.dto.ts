import {IsNotEmpty, IsOptional} from "class-validator";
import {IsObjectId} from "../../../validators/isObjectId.validator";
import {ApiProperty} from "@nestjs/swagger";
import {ObjectId} from "mongoose";

export class GetMainPhotoBySocketsDto {
    @IsNotEmpty()
    @IsObjectId()
    @ApiProperty({type: String, required: true})
    public readonly userId: ObjectId;

    @IsOptional()
    @ApiProperty({type: Number, required: false})
    public readonly offset: number = 0;

    @IsOptional()
    @ApiProperty({type: Number, required: false})
    public readonly take: number = 10;
}
