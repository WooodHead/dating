import { ArrayMinSize, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class AlbumIdsDto {

    @IsArray()
    @ArrayMinSize(1)
    @Transform((items) => items.value.map(item => Types.ObjectId(item)))
    @ApiProperty({type: [String], required: true})
    public album_ids: Types.ObjectId[];

}
