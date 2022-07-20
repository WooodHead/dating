import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatLinkDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({type: String, required: true})
    public readonly chatLink: string;
}
