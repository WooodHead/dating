import {IsEnum, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {AcceptedGenderEnum} from "../notification.enum";
import {NotificationConfig} from "../schemas/notifications-configs.schema";
import {Type} from "class-transformer";

export class UpdateNotificationConfigDto {

    @IsNotEmpty()
    @IsEnum(AcceptedGenderEnum, {message: `Should be one of this ${Object.values(AcceptedGenderEnum)}`})
    @ApiProperty({type: String, enum: AcceptedGenderEnum})
    readonly genderType: AcceptedGenderEnum;

    @IsNotEmpty()
    @IsObject()
    @IsNotEmptyObject()
    @Type(() => NotificationConfig)
    @ValidateNested()
    @ApiProperty({type: NotificationConfig})
    configs: NotificationConfig
}
