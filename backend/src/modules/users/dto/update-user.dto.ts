import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({required: false, type: Number})
    readonly phone?: number;
}
