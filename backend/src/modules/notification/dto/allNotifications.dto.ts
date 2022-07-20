import {IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform, Type} from "class-transformer";

export class AllNotificationsDto {

    @IsOptional()
    @Transform(item => item.value == 'true')
    @ApiProperty({type: Boolean, required: false})
    public readonly isChecked?: boolean;

    @IsOptional()
    @ApiProperty({type: Number, required: false})
    @Type(() => Number)
    public readonly offset: number = 0;

    @IsOptional()
    @ApiProperty({type: Number, required: false})
    @Type(() => Number)
    public readonly take: number = 5;
}
