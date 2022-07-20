import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import {ObjectId, Types} from "mongoose";
import {GenderEnum} from "../enums/userProfile.enum";
import {Type} from "class-transformer";

export class CreateUserProfileDtoDto {

  @IsString({message: 'Should be string'})
  @ApiModelProperty({type: Types.ObjectId})
  readonly user: ObjectId;

  @IsString({message: 'Should be string'})
  @IsEnum(GenderEnum, {message: `Should be one of this ${GenderEnum}`})
  @ApiProperty({type: String, enum: GenderEnum})
  readonly gender: string;

  @ApiProperty({type: String, format: 'DD-MM-YYYY'})
  @IsDate()
  @Type(() => Date)
  readonly dob: Date;

  @IsString({message: 'Should be string'})
  @IsNotEmpty({message: 'Required'})
  @ApiProperty({type: String})
  readonly name: string;
}
