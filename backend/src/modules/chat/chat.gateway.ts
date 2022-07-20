import { OnGatewayConnection, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TokenService } from '../auth/token/token.service';
import { UsersService } from '../users/users.service';
import { first } from 'rxjs/operators';
import { ChatRoomsService } from './chat-rooms/chat-rooms.service';
import { ChatDeleteEvent, MessageSendEvent, MessagesReadEvent, RoomCreateEvent } from './chat.event';
import { AuthService } from '../auth/auth.service';
import { UserProfileService } from '../users/user-profile/user-profile.service';

@WebSocketGateway({
  namespace: '/chat'
})
export class ChatGateway implements OnGatewayConnection {

  private logger: Logger = new Logger('ChatGateway');

  public constructor(
      private readonly tokenService: TokenService,
      private readonly chatRoomService: ChatRoomsService,
      private readonly userService: UsersService,
      private readonly profileService: UserProfileService,
      private readonly eventEmitter: EventEmitter2,
      private readonly authService: AuthService,
  ) {
  }

  @WebSocketServer() wss: Server;

  @OnEvent(RoomCreateEvent.eventName)
  public roomCreate(event: RoomCreateEvent) {
    this.chatRoomService.getAggregationRoom(event.room._id, event.room.user).pipe(first()).subscribe(
        room => this.wss.in(this.gatewayChatRoom(String(event.room.user))).emit('room.create', room)
    )
  }

  @OnEvent(MessageSendEvent.eventName)
  public messageSend(event: MessageSendEvent) {
    this.wss.in(this.gatewayChatRoom(String(event.message.toUser))).emit('message.send', event.message);
  }

  @OnEvent(MessagesReadEvent.eventName)
  public messageRead(event: MessagesReadEvent) {
    if(event.msg.length <= 0 ) return 0;
    const resp = {
      chatLink: event.msg[0].chatLink,
      fromUser: event.msg[0].fromUser,
      toUser: event.msg[0].toUser,
      msgIds: event.msg.map(msg => msg._id)
    }
    this.wss.in(this.gatewayChatRoom(String(resp.fromUser))).emit('message.read', resp);
  }

  @OnEvent(ChatDeleteEvent.eventName)
  public chatDelete(event: ChatDeleteEvent) {
    this.profileService.findProfileByParam({
      user: event.user._id
    }).pipe(
     first()
    ).subscribe(
        profile => this.wss.in(this.gatewayChatRoom(String(event.toUser))).emit('chat.delete', {chatLink: event.chatLink, profile: profile})
    )
  }

  public handleConnection(client: Socket, ...args: any[]): void {

    this.authService.userFromWSHandshake(client).subscribe({
      next: user => {
        client.join(this.gatewayChatRoom(user._id));
        this.logger.log(user.email + ' has been connected');
      },
      error: () => {
        client.emit('error', 'forbidden');
        client.disconnect(true);
      }
    })
  }

  private gatewayChatRoom(userId: string): string {
    return `chat-room-${userId}`;
  }

}

