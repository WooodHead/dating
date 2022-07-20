import { Injectable } from '@nestjs/common';
import { combineLatest, map, Observable, of } from 'rxjs';
import { FilterQuery, Types } from 'mongoose';
import { catchError } from 'rxjs/operators';
import { ChatRoomDocuments } from './chat-rooms/schemas/chat-room.schema';
import { ChatRoomsService } from './chat-rooms/chat-rooms.service';


@Injectable()
export class ChatService {

    public constructor(
        private readonly roomService: ChatRoomsService
    ) {}

    public createNewChatRooms(authUserId: Types.ObjectId, toUserId: Types.ObjectId)
        : Observable<{ authUserRoom: ChatRoomDocuments, toUserRoom: ChatRoomDocuments }> {
        const chatLink = String(authUserId) + String(toUserId);
        return combineLatest([
            this.roomService.createRoom(authUserId, toUserId, chatLink),
            this.roomService.createRoom(toUserId, authUserId, chatLink),
        ]).pipe(
            map(data => {
                return {authUserRoom: data[0], toUserRoom: data[1]}
            })
        )
    }

    public chatLink(authUserId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<string> {
        return this.roomService.findRoom({
            user: authUserId,
            toUser: targetUserId,
        } as FilterQuery<ChatRoomDocuments>).pipe(
            map(room => (room) ? room.chatLink : ''),
            catchError(e => of(''))
        )
    }
}
