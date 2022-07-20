import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationEmailDto {

  @IsEmail({},{message: 'Incorrect email format'})
  @IsNotEmpty({message: 'Required'})
  @ApiProperty({type: 'string'})
  readonly email: string;
}
