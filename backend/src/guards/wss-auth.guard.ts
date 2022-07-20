import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { map, Observable, of, switchMap, throwError, } from 'rxjs';
import { Socket } from 'socket.io';
import { UsersService } from '../modules/users/users.service';
import { TokenService } from '../modules/auth/token/token.service';
import { WsException } from '@nestjs/websockets';
import { WssException } from '../exceptions/wss.exception';
import { catchError } from 'rxjs/operators';

@Injectable()
export class WssAuthGuard implements CanActivate {

    private logger: Logger = new Logger('WSSGuard');

    public constructor(
        protected userService: UsersService,
        protected tokenService: TokenService
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const socket = context.switchToWs().getClient<Socket>();
        const token = socket.handshake.headers.authorization.split(' ').pop();

        const client = context.switchToWs().getClient();
        if (!token) throw new WsException('Unauthorized access');
        return of(token).pipe(
            switchMap(token => this.tokenService.validateLoginToken(token)),
            switchMap(token => this.userService.findUserByParam({_id: token.user}).pipe(
                map((user) => {
                    client.user = user;
                    return true;
                }))
            ),
            catchError((e) => throwError(() => {
                new WssException('Unauthorized access', client);
            })),
        )
    }

}
