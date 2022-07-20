import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { ChatRoomDocuments } from '../chat-rooms/schemas/chat-room.schema';
import { ForbiddenWords, ForbiddenWordsDocuments } from './schemas/forbidden-words.schema';
import { ChatMessage, ChatMessageDocuments } from './schemas/chat-message.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { IMessagesType } from './types/IMessages.type';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';


@Injectable()
export class MessagesService {

    public constructor(
        @InjectModel(ChatMessage.name) private readonly messageModel: Model<ChatMessageDocuments>,
        @InjectModel(ForbiddenWords.name) private readonly forbiddenWordsModel: Model<ForbiddenWordsDocuments>
    ) {}

    public saveMessage(room: ChatRoomDocuments, message: string): Observable<ChatMessageDocuments> {
        return of(new this.messageModel({
            fromUser: room.user,
            toUser: room.toUser,
            chatLink: room.chatLink,
            message
        })).pipe(
            switchMap(message => from(message.save()))
        )
    }

    public getAllUnreadMessages(authUserId: Types.ObjectId, chatLink: string, offset = 0, limit = 30)
        : Observable<{ UnreadMessages: ChatMessageDocuments[], UnreadMessagesCount: number }> {

        const match = {chatLink, isRead: false, toUser: authUserId};
        return this.getAggregateMessagesWithCount(match, [
            {$match: match},

            {$sort: {createdAt: 1}}
        ])
    }

    public getAggregateMessagesWithCount(match, pipelines: any[]): Observable<{ UnreadMessages: ChatMessageDocuments[], UnreadMessagesCount: number }> {
        return combineLatest({
            UnreadMessages: from(this.messageModel.aggregate<ChatMessageDocuments>(pipelines)),
            UnreadMessagesCount: from(this.messageModel.find(match as FilterQuery<ChatMessageDocuments>).countDocuments().exec())
        })
    }

    public getReadMessages(authUserId: Types.ObjectId, chatLink: string, offset = 0, limit = 30): Observable<ChatMessageDocuments[]> {
        if (limit <= 0) return of([]);
        return from(this.messageModel.aggregate([

            {$sort: {createdAt: -1}},

            {
                $match: {
                    $or: [
                        {
                            $and: [
                                {chatLink},
                                {toUser: {$ne: authUserId}}
                            ]
                        },
                        {
                            $and: [
                                {chatLink},
                                {toUser: authUserId},
                                {isRead: true}
                            ]
                        }
                    ]
                }
            },

            {$skip: offset},

            {$limit: limit},
        ]));
    }

    public getMiddleMessages(params: { authUserId: Types.ObjectId, chatLink: string, limit: number, offset: number }): Observable<IMessagesType> {
        return this.getAllUnreadMessages(params.authUserId, params.chatLink).pipe(
            switchMap(unreadMessages => this.getReadMessages(params.authUserId, params.chatLink, params.offset, params.limit).pipe(
                map(readMessages => {
                    return {
                        messages: readMessages.reverse(),
                        ...unreadMessages
                    }
                })
            ))
        )
    }

    public markAsReadMessage(messageIds: Types.ObjectId[], userId: Types.ObjectId, chatLink: string): Observable<ChatMessageDocuments[]> {
        const match = {
            $and: [
                {chatLink: chatLink},
                {_id: {$in: messageIds}},
                {toUser: userId}
            ]
        };

        const project = {_id: 1, chatLink: 1, toUser: 1, fromUser: 1};

        const updatedValue = {isRead: true};

        return MongooseHelpersService.findAndUpdate(this.messageModel, updatedValue, match, project);
    }

    public searchAndReplaceForbiddenWords(text: string): Observable<string> {

        return from(this.forbiddenWordsModel.find().exec()).pipe(
            map(words => {
                let _text = text;
                words.forEach(item => {
                    _text = _text.replace(new RegExp(item.word, 'gi'), () => {
                        return `${item.word[0]}${String('*').repeat(item.word.length - 1)}`
                    })
                })
                return _text;
            })
        )
    }

    public deleteMessagesByParams(param: { chatLink: string }): Observable<boolean> {
        return from(this.messageModel.deleteMany(param).exec()).pipe(
            map(result => (result.deletedCount >= 0))
        );
    }

    public countMessagesByUser(fromActiveUserId: Types.ObjectId, toActiveUserId: Types.ObjectId): Observable<any> {
        return from(this.messageModel.countDocuments(
            {fromUser: fromActiveUserId, toUser: toActiveUserId}
        ).exec())
    }
}
