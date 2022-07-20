import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {Match} from "../../../validators/match.validator";

export class ResetPassByTokenDto {

  @ApiProperty({type: String, minimum: 4, maximum: 20})
  @MinLength(4, {message: 'Should be more then 4'})
  @MaxLength(20, {message: 'Should be less then 20'})
  @IsNotEmpty({message: 'Required'})
  @IsString({message: 'Should be string'})
  readonly password: string;

  @ApiProperty({type: String, minimum: 4, maximum: 20})
  @MinLength(4, {message: 'Should be more then 4'})
  @MaxLength(20, {message: 'Should be less then 20'})
  @IsNotEmpty({message: 'Required'})
  @IsString({message: 'Should be string'})
  @Match('password')
  readonly r_password: string;
}
