import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class AvatarSaveDto {
    @ApiProperty({type: 'file'})
    @IsNotEmpty({message: 'Required'})
    readonly avatar: 'file';
}
