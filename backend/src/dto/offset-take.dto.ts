import {IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class OffsetTakeDto {

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({type: Number, required: false})
    public readonly offset: number = 0;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({type: Number, required: false})
    public readonly take: number = 10;
}
