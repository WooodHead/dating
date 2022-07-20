import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MessageSendEvent, MessagesReadEvent } from '../chat/chat.event';
import { first, switchMap } from 'rxjs/operators';
import { combineLatest, map, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { ChatRoomsService } from '../chat/chat-rooms/chat-rooms.service';
import { NotificationService } from './notification.service';
import { AlbumRequestEvent, AlbumShareEvent } from '../album/album.event';
import { AlbumNotificationService } from './album-notification.service';
import { MessageNotificationService } from './message-notification.service';
import { MessageReadNotificationEvent } from './notification.event';
import { Types } from 'mongoose';
import { UserRegistrationComplete } from '../users/events/user.event';

@Injectable()
export class NotificationListeners {

    constructor(
        private readonly UserProfileServices: UserProfileService,
        private readonly roomService: ChatRoomsService,
        private readonly notificationService: NotificationService,
        private readonly albumNotificationService: AlbumNotificationService,
        private readonly messageNotificationService: MessageNotificationService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @OnEvent(UserRegistrationComplete.eventName)
    userRegistrationComplete(event: UserRegistrationComplete) {
        this.notificationService.createNotificationConfigDocument(event.user._id)
            .pipe(first())
            .subscribe()
    }

    @OnEvent(MessageSendEvent.eventName)
    sendMessageEvent(event: MessageSendEvent) {
        combineLatest({
            message: of(event.message),
            fromUserProfile: this.UserProfileServices.findProfileByParam({user: event.message.fromUser}, {
                name: 1,
                gender: 1,
                user: 1
            }),
            room: this.roomService.findRoom({chatLink: event.message.chatLink, user: event.message.toUser})
        }).pipe(
            switchMap(data => this.messageNotificationService.checkAllowSendMessageNotification(data.room, data.fromUserProfile, event.message.toUser).pipe(
                map(notificationConfigs => {
                    return {...data, notificationConfigs}
                })
            )),
            switchMap(data => (data.notificationConfigs.emailResult || data.notificationConfigs.websiteResult)
                ? this.messageNotificationService.createMessageSendNotification(event.message.fromUser, event.message.toUser, event.message, data.notificationConfigs.websiteResult)
                    .pipe(map(model => {return {...data, notification: model}}))
                : of({...data, notification: null})
            ),
            first()
        ).subscribe()
    }

    @OnEvent(AlbumShareEvent.eventName)
    public albumShare(event: AlbumShareEvent) {
        this.UserProfileServices.findProfileByParam({user: event.permission.userId}, {
            name: 1,
            gender: 1,
            user: 1
        }).pipe(
            switchMap(profile => this.albumNotificationService.checkAllowShareAlbumNotification(profile, event.album.belongTo)),
            switchMap(configs => (configs.emailResult || configs.websiteResult)

                ? this.albumNotificationService.createShareAlbumNotification(
                    event.permission.userId,
                    event.permission.targetUserId,
                    event.album,
                    configs.websiteResult
                )

                : of(null)
            ),
            first()
        ).subscribe()
    }

    @OnEvent(AlbumRequestEvent.eventName)
    public requestAlbumShare(event: AlbumRequestEvent) {
        this.UserProfileServices.findProfileByParam({user: event.fromUserId}, {
            name: 1,
            gender: 1,
            user: 1
        }).pipe(
            switchMap(profile => this.albumNotificationService.checkAllowShareAlbumNotification(profile, event.album.belongTo)),
            switchMap(configs => (configs.emailResult || configs.websiteResult)

                ? this.albumNotificationService.createRequestAlbumNotification(
                    event.fromUserId,
                    event.album.belongTo,
                    event.album,
                    configs.websiteResult
                )

                : of(null)
            ),
            first()
        ).subscribe()
    }

    @OnEvent(MessagesReadEvent.eventName)
    public messagesRead(event: MessagesReadEvent) {
        const messagesIds = event.msg.map(
            message => message._id
        );

        if (messagesIds.length == 0) return;

        const userId: Types.ObjectId = event.msg.pop().toUser;

        this.notificationService.findNotificationsByParams({
            'additionalData.messageId': {$in: messagesIds}
        }, {_id: 1}).pipe(
            map(models => models.map(
                model => model._id
            )),
            switchMap(notificationsIds => this.notificationService.deleteNotificationsByParams({_id: {$in: notificationsIds}}).pipe(
                map(result => {
                    return {result, notificationsIds}
                }))
            ),
            first()
        ).subscribe(data => {
            this.eventEmitter.emit(MessageReadNotificationEvent.eventName, new MessageReadNotificationEvent(userId, data.notificationsIds));
        })
    }
}
