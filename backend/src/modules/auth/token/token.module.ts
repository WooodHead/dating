import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {JwtModule} from "@nestjs/jwt";
import * as fs from "fs";
import {FileService} from "../../file/file.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Token, TokenSchema} from "./schemas/token.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({
      privateKey: fs.readFileSync( FileService.privateKeyPemPath, 'utf8'),
      publicKey: fs.readFileSync( FileService.publicKeyPemPath, 'utf8'),
      signOptions: {
        algorithm: 'RS256'
      }
    }),
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
