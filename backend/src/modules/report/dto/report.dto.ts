import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TargetUseridDto } from '../../../dto/target-userid.dto';

export class ReportDto extends PartialType(TargetUseridDto) {

    @ApiProperty({type: String})
    @IsNotEmpty({message: 'Required'})
    readonly reason: string;
}
