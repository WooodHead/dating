import { Module } from '@nestjs/common';
import { UsersRelationsService } from './users-relations.service';
import { UsersRelationsController } from './users-relations.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Relations, RelationsSchema} from "./schemas/relations.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Relations.name, schema: RelationsSchema }]),
  ],
  providers: [UsersRelationsService],
  controllers: [UsersRelationsController],
  exports: [UsersRelationsService]
})
export class UsersRelationsModule {}
