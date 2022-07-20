import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {AlbumTypeEnum} from "../enums/album.enum";

export class AlbumUpdateDto {

    @IsNotEmpty()
    @IsString({message: 'Should be string'})
    @ApiProperty({type: String, required: true})
    public readonly name: string;

    @IsNotEmpty()
    @IsEnum(AlbumTypeEnum, {message: `Should be one of this ${Object.values(AlbumTypeEnum)}`})
    @ApiProperty({type: String, enum: AlbumTypeEnum, required: true})
    public readonly type?: AlbumTypeEnum;
}
