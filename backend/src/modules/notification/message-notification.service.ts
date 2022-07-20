import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, map, Observable, of, tap } from 'rxjs';
import { Notification, NotificationsDocuments } from './schemas/notification.schema';
import { NotificationEventTypesEnum } from './notification.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageSendNotificationEvent } from './notification.event';
import { FrontFormatMessagesNotification } from './notification.type';
import { NotificationService } from './notification.service';
import { ChatRoomDocuments } from '../chat/chat-rooms/schemas/chat-room.schema';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { ChatMessageDocuments } from '../chat/messages/schemas/chat-message.schema';

@Injectable()
export class MessageNotificationService {

    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationsDocuments>,
        private readonly notificationService: NotificationService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    public createMessageSendNotification(fromUser: Types.ObjectId, toUser: Types.ObjectId, message: ChatMessageDocuments, isNeedToSendEvent: boolean = false): Observable<NotificationsDocuments> {
        return from(this.notificationModel.create({
            fromUser,
            toUser,
            eventType: NotificationEventTypesEnum.sendMessage,
            additionalData: {
                messageId: message._id,
                chatLink: message.chatLink,
            }
        })).pipe(
            tap(model => {
                    if (isNeedToSendEvent) this.eventEmitter.emit(MessageSendNotificationEvent.eventName, new MessageSendNotificationEvent(model))
                }
            ))
    }

    public checkAllowSendMessageNotification(room: ChatRoomDocuments, fromUserprofile: UserProfileDocuments, toUserId: Types.ObjectId): Observable<{emailResult: boolean, websiteResult: boolean}> {
        if(room.config.isMute) return of({emailResult: false, websiteResult: false});
        return this.notificationService.findOrCreateNotificationConfigDocument(toUserId).pipe(
            map(config => {
                return {
                    websiteResult: (this.notificationService.genderCheck(config, fromUserprofile) && config.configs.global.website && config.configs.message.website),
                    emailResult: (this.notificationService.genderCheck(config, fromUserprofile) && config.configs.global.email && config.configs.message.email),
                }
            })
        )
    }

    public getMessageNotificationByUser(userId: Types.ObjectId): Observable<FrontFormatMessagesNotification[]> {
        return from(this.notificationModel.aggregate<FrontFormatMessagesNotification>([
            {
                $match: {
                    $and: [
                        {toUser: userId},
                        {eventType: NotificationEventTypesEnum.sendMessage}
                    ]
                }
            },
            {
                $addFields: {
                    chatLink: '$additionalData.chatLink'
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
                    createdAt: 1,
                    chatLink: 1,
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
