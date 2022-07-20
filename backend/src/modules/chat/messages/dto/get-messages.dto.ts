import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OffsetTakeDto } from '../../../../dto/offset-take.dto';

export class GetMessagesDto extends PartialType(OffsetTakeDto){

    @IsString({message: 'Should be string'})
    @IsNotEmpty()
    @ApiProperty({type: String, required: true})
    public readonly chatLink: string;
}
