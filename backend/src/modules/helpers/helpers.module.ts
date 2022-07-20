import { Module } from '@nestjs/common';
import { AuthHelpersService } from './auth-helpers.service';
import {MongooseHelpersService} from "./mongoose-helpers.service";
import {FileHelperService} from "./file-helper.service";

@Module({
  providers: [AuthHelpersService, MongooseHelpersService, FileHelperService],
  exports: [AuthHelpersService, MongooseHelpersService, FileHelperService],
})
export class HelpersModule {}
