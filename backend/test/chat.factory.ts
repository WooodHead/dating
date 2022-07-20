import { combineLatest, concatMap, map, Observable, shareReplay, switchMap } from 'rxjs';
import { DataSet } from './app.e2e-spec';
import { MessagesService } from '../src/modules/chat/messages/messages.service';
import * as faker from 'faker';
import { repeat } from 'rxjs/operators';
import { Types } from 'mongoose';
import { ChatRoomsService } from '../src/modules/chat/chat-rooms/chat-rooms.service';

export class ChatFactory {

    private messagesService$: Observable<MessagesService> = this.data$.pipe(
        map(data => data.moduleRef.get<MessagesService>(MessagesService)),
        shareReplay(1)
    )

    private roomService$: Observable<ChatRoomsService> = this.data$.pipe(
        map(data => data.moduleRef.get<ChatRoomsService>(ChatRoomsService)),
        shareReplay(1)
    )

    constructor(
        private readonly data$: Observable<DataSet>
    ) {}

    public generateMessages(chatRoomId: Types.ObjectId, messagesCount: number): Observable<any> {
        return combineLatest({
            service: this.messagesService$,
            room: this.roomService$.pipe(
                switchMap(service => service.findRoom({_id: chatRoomId}))
            )
        }).pipe(
            concatMap(data => data.service.saveMessage(data.room, faker.lorem.word()).pipe(repeat(messagesCount))),
        )
    }
}
