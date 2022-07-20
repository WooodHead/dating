import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { NotificationsConfigs, NotificationsConfigsDocuments } from './schemas/notifications-configs.schema';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { UpdateNotificationConfigDto } from './dto/updateNotificationConfig.dto';
import { Notification, NotificationsDocuments } from './schemas/notification.schema';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { AcceptedGenderEnum } from './notification.enum';

@Injectable()
export class NotificationService {

    constructor(
        @InjectModel(NotificationsConfigs.name) private readonly notificationConfigModel: Model<NotificationsConfigsDocuments>,
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationsDocuments>,
    ) {}

    public findOrCreateNotificationConfigDocument(userId: Types.ObjectId, protection: any = {
        __v: 0,
        user: 0
    }): Observable<NotificationsConfigsDocuments> {
        return MongooseHelpersService.findOne(this.notificationConfigModel, {user: userId}, protection, {new: true}).pipe(
            switchMap(model => (model) ? of(model) : this.createNotificationConfigDocument(userId))
        )
    }

    public createNotificationConfigDocument(userId: Types.ObjectId): Observable<NotificationsConfigsDocuments>  {
        return from(this.notificationConfigModel.create({user: userId}));
    }

    public findNotificationsByParams(filter: FilterQuery<NotificationsDocuments>, projection?: any | null): Observable<NotificationsDocuments[]> {
        return from(this.notificationModel.find(filter, projection).exec())
    }

    public findNotificationsConfigByParams(filter: FilterQuery<NotificationsConfigsDocuments>, projection?: any | null): Observable<NotificationsConfigsDocuments[]> {
        return from(this.notificationConfigModel.find(filter, projection).exec())
    }

    public updateNotificationConfigModel(notificationConfig: NotificationsConfigsDocuments, dto: UpdateNotificationConfigDto): Observable<NotificationsConfigsDocuments> {
        return of(notificationConfig).pipe(
            map(config => Object.assign(config, dto)),
            switchMap(config => config.save())
        )
    }

    public genderCheck(notificationConfig: NotificationsConfigsDocuments, sourceUserProfile: UserProfileDocuments): boolean {
        return (notificationConfig.genderType == AcceptedGenderEnum.all || notificationConfig.genderType == sourceUserProfile.gender);
    }

    public deleteNotificationsByUser(userId: Types.ObjectId): Observable<boolean> {
        return from(this.notificationModel.deleteMany({toUser: userId}).exec()).pipe(
            map(result => (result.deletedCount > 0))
        );
    }

    public deleteNotificationsByParams(filter: FilterQuery<NotificationsDocuments>): Observable<boolean> {
        return from(this.notificationModel.deleteMany(filter).exec()).pipe(
            map(result => (result.deletedCount > 0))
        );
    }
}
