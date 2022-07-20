import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Types} from "mongoose";

export class MessagesIdDto {
    @IsNotEmpty()
    @IsString({each: true})
    @ApiProperty({type: [String], required: true})
    public readonly messagesIds: Types.ObjectId[];
}
