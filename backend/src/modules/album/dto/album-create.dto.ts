import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";
import {AlbumTypeEnum} from "../enums/album.enum";

export class AlbumCreateDto {

    @IsString({message: 'Should be string'})
    @ApiProperty({type: String, enum: AlbumTypeEnum})
    readonly type: AlbumTypeEnum;

    @IsString({message: 'Should be string'})
    @ApiProperty({type: String})
    readonly name: string;

}
