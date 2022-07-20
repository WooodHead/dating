import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OffsetTakeDto } from '../../../dto/offset-take.dto';

export class SearchUserShareDto extends PartialType(OffsetTakeDto) {

    @IsNotEmpty()
    @ApiProperty({type: String, minimum: 3, required: true})
    @MinLength(3, {message: 'Should be more then 3 symbols'})
    public readonly name: string;
}
