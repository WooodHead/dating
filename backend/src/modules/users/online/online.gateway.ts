import { WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '../../auth/auth.service';
import { OnlineStatusEvent } from '../events/online-status.event';
import { UsersService } from '../users.service';

@WebSocketGateway({
  namespace: '/online'
})
export class OnlineGateway {

  public static readonly loginEvent = 'login';
  public static readonly logoutEvent = 'logout';

  private logger: Logger = new Logger('OnlineGateway');

  public constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  @WebSocketServer() wss: Server;

  public handleConnection(client: Socket, ...args: any[]): void {
    this.authService.userFromWSHandshake(client).subscribe({
      next: user => {
        this.wss.in('online').emit(OnlineGateway.loginEvent, user._id);
        client.join('online');
        this.eventEmitter.emit(OnlineStatusEvent.eventName, new OnlineStatusEvent(user, true, client.id));
        this.logger.log(user.email + ' online');
      },
      error: (e) => {
        this.logger.error(e);
        client.emit('error', 'forbidden');
        client.disconnect(true);
      }
    })
  }

  public handleDisconnect(client: Socket): any {
    this.usersService.findUserByParam({socketId: client.id}).subscribe({
      next: user => {
        this.eventEmitter.emit(OnlineStatusEvent.eventName, new OnlineStatusEvent(user, false));
        this.wss.in('online').emit(OnlineGateway.logoutEvent, user._id);
        this.logger.log(user.email + ' offline');
      },
      error: (e) => {
        this.logger.error(e);
      }
    })
  }
}

