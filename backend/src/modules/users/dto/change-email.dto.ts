import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";
import {EmailNotExistInDB} from "../../../validators/emailNotExistInDB.validator";

export class ChangeEmailDto {

  @IsEmail({},{message: 'Incorrect email format'})
  @IsNotEmpty({message: 'Required'})
  @EmailNotExistInDB()
  @ApiProperty({type: 'string'})
  readonly email: string;
}
