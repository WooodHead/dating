import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, map, Observable, tap } from 'rxjs';
import { Notification, NotificationsDocuments } from './schemas/notification.schema';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { NotificationEventTypesEnum } from './notification.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlbumSharePermissionNotificationEvent, RequestSharePermissionNotificationEvent } from './notification.event';
import { AlbumDocuments } from '../album/schemas/album.schema';
import { NotificationService } from './notification.service';
import { FrontFormatAlbumShareNotification } from './notification.type';

@Injectable()
export class AlbumNotificationService {

    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationsDocuments>,
        private readonly notificationService: NotificationService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    public checkAllowShareAlbumNotification(fromUserprofile: UserProfileDocuments, toUserId: Types.ObjectId): Observable<{ emailResult: boolean, websiteResult: boolean }> {
        return this.notificationService.findOrCreateNotificationConfigDocument(toUserId).pipe(
            map(config => {
                return {
                    websiteResult: (this.notificationService.genderCheck(config, fromUserprofile) && config.configs.global.website && config.configs.sharedAlbum.website),
                    emailResult: (this.notificationService.genderCheck(config, fromUserprofile) && config.configs.global.email && config.configs.sharedAlbum.email),
                }
            })
        )
    }

    public createShareAlbumNotification(fromUser: Types.ObjectId, toUser: Types.ObjectId, album: AlbumDocuments, isNeedToSendEvent: boolean = false): Observable<NotificationsDocuments> {
        return from(this.notificationModel.create({
            fromUser,
            toUser,
            eventType: NotificationEventTypesEnum.shareAlbum,
            additionalData: {
                albumId: album._id,
                albumName: album.name
            }
        })).pipe(
            tap(model => {
                    if (isNeedToSendEvent) this.eventEmitter.emit(AlbumSharePermissionNotificationEvent.eventName, new AlbumSharePermissionNotificationEvent(model))
                }
            ))
    }

    public createRequestAlbumNotification(fromUser: Types.ObjectId, toUser: Types.ObjectId, album: AlbumDocuments, isNeedToSendEvent: boolean = false): Observable<NotificationsDocuments> {
        return from(this.notificationModel.create({
            fromUser,
            toUser,
            eventType: NotificationEventTypesEnum.requestToShare,
            additionalData: {
                albumId: album._id,
                albumName: album.name
            }
        })).pipe(
            tap(model => {
                    if (isNeedToSendEvent) this.eventEmitter.emit(RequestSharePermissionNotificationEvent.eventName, new RequestSharePermissionNotificationEvent(model))
                }
            ))
    }

    public getAllNotificationByUser(userId: Types.ObjectId): Observable<FrontFormatAlbumShareNotification[]> {
        return from(this.notificationModel.aggregate<FrontFormatAlbumShareNotification>([
            {
                $match: {
                    $and: [
                        {toUser: userId},
                        {eventType: NotificationEventTypesEnum.shareAlbum}
                    ]
                }
            },
            {
                $addFields: {
                    album: {
                        _id: '$additionalData.albumId',
                        name: '$additionalData.albumName',
                    }
                }
            },
            {
                $lookup: {
                    from: 'userprofiles', localField: 'fromUser', foreignField: 'user', as: 'profile'
                }
            },

            {$unwind: {path: '$profile'}},

            {
                $project: {
                    _id: 1,
                    album: 1,
                    'profile.online': 1,
                    'profile._id': 1,
                    'profile.avatarPath': 1,
                    'profile.smAvatarPath': 1,
                    'profile.name': 1,
                    'profile.user': 1
                }
            },
        ]))
    }
}
