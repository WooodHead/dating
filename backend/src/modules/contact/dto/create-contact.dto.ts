import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import {Prop} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";

export class CreateContactDto {

  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty({type: String, required: true})
  readonly email: string;

  @IsNotEmpty()
  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  readonly firstName: string;

  @IsNotEmpty()
  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  readonly lastName: string;

  @IsNotEmpty()
  @Prop({required: true})
  @ApiProperty({type: String, required: true})
  readonly message: string;

}
