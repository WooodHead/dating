import {IsOptional, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SearchLocationDto {

    @ApiProperty({type: String, minimum: 3, required: true})
    @MinLength(3, {message: 'Should be more then 3 symbols'})
    public readonly cityName: string;

    @IsOptional()
    @ApiProperty({type: Number, required: false})
    public readonly offset: number;

    @IsOptional()
    @ApiProperty({type: Number, required: false})
    public readonly take: number;
}
