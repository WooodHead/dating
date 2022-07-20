import { OnGatewayConnection, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AuthService } from '../auth/auth.service';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { ChatRoomsService } from '../chat/chat-rooms/chat-rooms.service';
import {
    AlbumSharePermissionNotificationEvent,
    MessageReadNotificationEvent,
    MessageSendNotificationEvent, RequestSharePermissionNotificationEvent
} from './notification.event';
import { first } from 'rxjs/operators';

@WebSocketGateway({
  namespace: '/notification'
})
export class NotificationGateway implements OnGatewayConnection {

  private logger: Logger = new Logger('NotificationGateway');

  public static readonly messageSendEvent = 'message.send';
  public static readonly albumShareEvent = 'album.share';
  public static readonly albumRequestToShareEvent = 'album.share.request';
  public static readonly messageReadEvent = 'message.read';

  public constructor(
      private readonly eventEmitter: EventEmitter2,
      private readonly authService: AuthService,
      private readonly roomService: ChatRoomsService,
      private readonly profileService: UserProfileService,
  ) {
  }

  @WebSocketServer() wss: Server;

  @OnEvent(MessageSendNotificationEvent.eventName)
  public messageSend(event: MessageSendNotificationEvent) {
    this.profileService.findProfileByParam(
      {user: event.notification.fromUser}, {
        _id: 1,
        avatarPath: 1,
        online: 1,
        name: 1,
        user: 1
      }).pipe(
      first()
    ).subscribe(
      profile => this.wss.in(this.gatewayNotificationRoom(String(event.notification.toUser))).emit(NotificationGateway.messageSendEvent, {
        _id: event.notification._id,
        profile,
        chatLink: event.notification.additionalData.chatLink,
        createdAt: event.notification.createdAt
      })
    )

  }

  @OnEvent(AlbumSharePermissionNotificationEvent.eventName)
  public albumSharePermission(event: AlbumSharePermissionNotificationEvent) {
    this.profileService.findProfileByParam(
      {user: event.notification.fromUser}, {
        _id: 1,
        avatarPath: 1,
        online: 1,
        name: 1,
        user: 1
      }).pipe(
      first()
    ).subscribe(
      profile => this.wss.in(this.gatewayNotificationRoom(String(event.notification.toUser))).emit(NotificationGateway.albumShareEvent, {
        _id: event.notification._id,
        profile,
        album: {
            _id: event.notification.additionalData.albumId,
            name: event.notification.additionalData.albumName,
        },
        createdAt: event.notification.createdAt
      })
    )

  }

  @OnEvent(RequestSharePermissionNotificationEvent.eventName)
  public albumRequestPermission(event: RequestSharePermissionNotificationEvent) {
    this.profileService.findProfileByParam(
      {user: event.notification.fromUser}, {
        _id: 1,
        avatarPath: 1,
        online: 1,
        name: 1,
        user: 1
      }).pipe(
      first()
    ).subscribe(
      profile => this.wss.in(this.gatewayNotificationRoom(String(event.notification.toUser))).emit(NotificationGateway.albumRequestToShareEvent, {
        _id: event.notification._id,
        profile,
        album: {
            _id: event.notification.additionalData.albumId,
            name: event.notification.additionalData.albumName,
        },
        createdAt: event.notification.createdAt
      })
    )

  }

  @OnEvent(MessageReadNotificationEvent.eventName)
  public messagesRead(event: MessageReadNotificationEvent) {
      this.wss.in(this.gatewayNotificationRoom(String(event.userId))).emit(NotificationGateway.messageReadEvent, event.notificationsIds);
  }

  public handleConnection(client: Socket, ...args: any[]): void {

    this.authService.userFromWSHandshake(client).subscribe({
      next: user => {
        client.join(this.gatewayNotificationRoom(user._id));
      },
      error: (e) => {
        client.emit('error', 'forbidden');
        client.disconnect(true);
      }
    })
  }

  private gatewayNotificationRoom(userId: string): string {
    return `notification-room-${userId}`;
  }

}

