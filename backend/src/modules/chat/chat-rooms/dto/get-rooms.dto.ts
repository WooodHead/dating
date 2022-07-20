import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { OffsetTakeDto } from '../../../../dto/offset-take.dto';

export class GetRoomsDto extends PartialType(OffsetTakeDto) {

    @IsBoolean()
    @IsOptional()
    @Transform(item => item.value == 'true')
    @ApiProperty({type: Boolean, required: false, default: false})
    public readonly isArchived: boolean = false;
}
