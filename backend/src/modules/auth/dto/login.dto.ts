import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({type: String, description: 'email'})
  readonly email: string;

  @ApiProperty({type: String, description: 'password'})
  readonly password: string;
}
