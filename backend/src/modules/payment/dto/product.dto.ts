import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {

    @IsNotEmpty()
    @Transform((item) => Types.ObjectId(item.value))
    @ApiProperty({type: String, required: true})
    public productId: Types.ObjectId;

}
