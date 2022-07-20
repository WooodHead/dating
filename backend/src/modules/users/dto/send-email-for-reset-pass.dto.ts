import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";
import {EmailExistInDB} from "../../../validators/emailExistInDB.validator";

export class SendEmailForResetPassDto {

  @IsEmail({},{message: 'Incorrect email'})
  @IsNotEmpty({message: 'Required'})
  @EmailExistInDB()
  @ApiProperty({type: 'string'})
  readonly email: string;
}
