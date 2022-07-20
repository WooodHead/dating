import { E2eTest } from '../IE2e.test';
import {
    combineLatest,
    concatMap,
    from,
    mergeMap,
    Observable,
    of,
    ReplaySubject,
    shareReplay,
    switchMap,
    tap
} from 'rxjs';
import * as request from 'supertest';
import { delay, first } from 'rxjs/operators';
import { RegistrationResponse } from '../../src/modules/auth/auth.type';
import { UserFactory } from '../test.factory';
import { Types } from 'mongoose';
import { ChatFactory } from '../chat.factory';

export class ChatE2e extends E2eTest {

    private chatFactory$: Observable<ChatFactory> = of(new ChatFactory(this.data$)).pipe(
        shareReplay(1)
    );

    private firstUser$: Observable<RegistrationResponse & {token: string}> = of(new UserFactory(this.data$)).pipe(
        mergeMap(factory => factory.createUser()),
        first(),
        shareReplay()
    )

    private secondUser$: Observable<RegistrationResponse & {token: string}> = of(new UserFactory(this.data$)).pipe(
        mergeMap(factory => factory.createUser()),
        first(),
        shareReplay()
    )

    private chatRoomUser$: ReplaySubject<Types.ObjectId> = new ReplaySubject(1);

    private chatRoomSecondUser$: ReplaySubject<Types.ObjectId> = new ReplaySubject(1);


    private chatLink$: ReplaySubject<string> = new ReplaySubject(1);

    private chatId$: ReplaySubject<string> = new ReplaySubject<string>(1);

    protected testsDescription = 'Chat'

    protected tests = [
        {
            name: 'send message to user',
            fn: this.sendMessage()
        }, {
            name: 'check get and update message',
            fn: this.checkMessages()
        }, {
            name: 'check get and update rooms',
            fn: this.checkRooms()
        }, {
            name: 'delete chat',
            fn: this.deleteChat()
        }
    ]


    public sendMessage(): Observable<any> {

        return combineLatest({
            data: this.data$,
            user: this.firstUser$,
            secondUser: this.secondUser$
        }).pipe(
            switchMap(result => combineLatest({
                    roomEventUser: result.data.socket.channel('chat', result.user.token).pipe(
                        switchMap(channel => channel.event<any>('room.create')),
                        tap(room => expect(room.chatLink).toBeDefined()),
                        tap(room => expect(room.profile.name).toEqual(result.secondUser.profile.name)),
                        tap(room => this.chatRoomUser$.next(Types.ObjectId(room._id))),
                        tap(room => this.chatLink$.next(room.chatLink)),
                    ),
                    roomEventSecondUser: result.data.socket.channel('chat', result.secondUser.token).pipe(
                        switchMap(channel => channel.event<any>('room.create')),
                        tap(room => expect(room.chatLink).toBeDefined()),
                        tap(room => expect(room.profile.name).toEqual(result.user.profile.name)),
                        tap(room => this.chatRoomSecondUser$.next(Types.ObjectId(room._id))),
                    ),
                    messageEvent: result.data.socket.channel('chat', result.secondUser.token).pipe(
                        switchMap(channel => channel.event<any>('message.send')),
                        tap(message => expect(message.chatLink).toBeDefined()),
                        tap(message => expect(message.message).toEqual('test')),
                    ),
                    request: from(
                        request(result.data.httpServer)
                            .post(`/chat/send`)
                            .send({targetUserId: result.secondUser.profile.user, message: 'test'})
                            .set('Authorization', `Bearer ${result.user.token}`)
                            .expect(201)
                    ).pipe(
                        tap(response => expect(response.body.chatId).toBeDefined()),
                        tap(response => this.chatId$.next(response.body.chatId)),
                    ),
                }).pipe(
                    delay(1000),
                )
            ),
        )
    }

    public checkMessages(): Observable<any> {
        let messageId: Types.ObjectId;

        return combineLatest({
            data: this.data$,
            user: this.firstUser$,
            secondUser: this.secondUser$,
            chatLink: this.chatLink$,
            chatFactory: this.chatFactory$
        }).pipe(
            concatMap(result => from(
                request(result.data.httpServer)
                    .get(`/chat/messages-middle`)
                    .query({chatLink: result.chatLink})
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .expect(200)
            ).pipe(
                tap(response => expect(response.body.messages.length).toBeGreaterThan(0)),
                delay(300),
                tap(response => messageId = Types.ObjectId(response.body.messages[0]._id)),
                switchMap(response => from(
                    request(result.data.httpServer)
                        .post(`/chat/mark-as-read`)
                        .set('Authorization', `Bearer ${result.secondUser.token}`)
                        .send({messagesIds: response.body.messages[0]._id, chatLink: result.chatLink})
                        .expect(200)
                )),
                delay(300),
                concatMap(() => from(
                    request(result.data.httpServer)
                        .get(`/chat/messages`)
                        .query({chatLink: result.chatLink})
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                )),
                tap(response => expect(response.body[0].isRead).toBeTruthy()
            )),
        ))
    }

    public checkRooms(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.firstUser$,
            secondUser: this.secondUser$,
            chatLink: this.chatLink$,
            chatFactory: this.chatFactory$
        }).pipe(
            switchMap(result => from(
                request(result.data.httpServer)
                    .patch(`/chat-rooms/${result.chatLink}`)
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .send({isMute: true})
                    .expect(200)
            ).pipe(
                delay(300),
                switchMap(() => from(
                    request(result.data.httpServer)
                        .get(`/chat-rooms`)
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                )),
                tap(response => expect(response.body.length).toBeGreaterThan(0)),
                tap(response => expect(response.body[0].config.isMute).toBeTruthy()),
            ))


        )
    }

    public deleteChat(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.firstUser$,
            secondUser: this.secondUser$,
            chatLink: this.chatLink$,
            chatFactory: this.chatFactory$
        }).pipe(
            switchMap(result => from(
                request(result.data.httpServer)
                    .delete(`/chat/${result.chatLink}`)
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .expect(200)
            ))
        )
    }
}
