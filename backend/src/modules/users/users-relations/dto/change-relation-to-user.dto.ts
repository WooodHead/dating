import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TargetUseridDto } from '../../../../dto/target-userid.dto';
import { RelationsEnum } from '../enums/relations.enum';

export class ChangeRelationToUserDto extends PartialType(TargetUseridDto) {

    @IsNotEmpty()
    @IsEnum(RelationsEnum, {message: `Should be one of this ${Object.values(RelationsEnum)}`})
    @ApiProperty({type: String, enum: RelationsEnum})
    relation: RelationsEnum

}
