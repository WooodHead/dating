import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema, Types } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AcceptedGenderEnum} from "../notification.enum";
import { IsBoolean, IsNotEmptyObject, IsObject, IsOptional, ValidateNested } from 'class-validator';
import {Transform, Type} from "class-transformer";

export type NotificationsConfigsDocuments = NotificationsConfigs & Document;

export class PropertyConfig {

  @IsBoolean()
  @Type(() => Boolean)
  @Prop({type: Boolean, default: true})
  @ApiProperty({type: Boolean, default: true})
  website: boolean = true;

  @IsBoolean()
  @Type(() => Boolean)
  @Prop({type: Boolean, default: true})
  @ApiProperty({type: Boolean, default: true})
  email: boolean = true;
}

export class NotificationConfig {

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PropertyConfig)
  @ValidateNested()
  @Prop({type: Boolean, default: new PropertyConfig()})
  @ApiProperty({type: PropertyConfig, default: new PropertyConfig()})
  global: PropertyConfig = new PropertyConfig();

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PropertyConfig)
  @ValidateNested()
  @Prop({type: Boolean, default: new PropertyConfig()})
  @ApiProperty({type: PropertyConfig, default: new PropertyConfig()})
  message: PropertyConfig = new PropertyConfig();

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PropertyConfig)
  @ValidateNested()
  @Prop({type: Boolean, default: true})
  @ApiProperty({type: PropertyConfig, default: new PropertyConfig()})
  sharedAlbum: PropertyConfig = new PropertyConfig();
}

@Schema()
export class NotificationsConfigs {

  @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true, uniqueItems: true})
  @ApiProperty({type: MSchema.Types.ObjectId})
  user: Types.ObjectId;

  @Prop({required: true, type: String, enum: AcceptedGenderEnum, default: AcceptedGenderEnum.all})
  @ApiProperty({type: String, enum: AcceptedGenderEnum, default: AcceptedGenderEnum.all})
  genderType: AcceptedGenderEnum = AcceptedGenderEnum.all;

  @Prop({required: true, type: NotificationConfig, default: new NotificationConfig()})
  @ApiProperty({type: NotificationConfig, default: new NotificationConfig()})
  configs: NotificationConfig = new NotificationConfig();
}

export const NotificationsConfigsSchema = SchemaFactory.createForClass(NotificationsConfigs);
