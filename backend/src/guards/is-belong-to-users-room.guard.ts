import {
    CanActivate,
    ExecutionContext, HttpException, HttpStatus,
    Injectable, UnauthorizedException,
} from "@nestjs/common";
import {map, Observable, tap, throwError} from "rxjs";
import {ChatRoomsService} from "../modules/chat/chat-rooms/chat-rooms.service";
import {catchError} from "rxjs/operators";

@Injectable()
export class IsBelongToUsersRoomGuard implements CanActivate {

    public constructor(
        protected readonly chatRoomService: ChatRoomsService
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const authUser = context.switchToHttp().getRequest().user;
        const chatLink = context.switchToHttp().getRequest().query.chatLink;
        if(!authUser || !chatLink) throw new UnauthorizedException();

        return this.chatRoomService.findRoom({user: authUser._id, chatLink}).pipe(
            tap(room => context.switchToHttp().getRequest().room = room),
            map(room => !!(room)),
            catchError(e => {
                console.log(e)
                return throwError(() => new HttpException('room doesn\'t  exist',  HttpStatus.NOT_ACCEPTABLE))
            })
        )
    }

}
