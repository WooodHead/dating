import {ApiProperty} from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from 'class-validator';
import { EmailNotExistInDB } from '../../../validators/emailNotExistInDB.validator';

export class LendingRegistrationDto {

    @IsNotEmpty()
    @IsEmail()
    @EmailNotExistInDB()
    @ApiProperty({type: String, required: true})
    readonly email: string;

    @IsNotEmpty()
    @ApiProperty({type: String, required: true})
    readonly password: string;
}
