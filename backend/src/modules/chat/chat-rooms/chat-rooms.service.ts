import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ChatRoom, ChatRoomDocuments, RoomConfig } from './schemas/chat-room.schema';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';
import { IRoomType } from './types/IRoom.type';

@Injectable()
export class ChatRoomsService {

    public constructor(
        @InjectModel(ChatRoom.name) private readonly roomModel: Model<ChatRoomDocuments>,
    ) {}

    public getAggregationRoom(roomId: Types.ObjectId, authUserId: Types.ObjectId): Observable<IRoomType> {
        const match = {
            $expr: {$eq: ['$_id', roomId]}
        };

        return this.roomAggregate(match, authUserId,1, 0).pipe(
            map(rooms => (rooms.length) ? rooms[0] : null)
        );
    }

    public getAggregationRooms(authUserId: Types.ObjectId, isArchived: boolean, take: number, offset: number): Observable<IRoomType[]> {

        const match = {
            $and: [
                {$expr: {$eq: ['$user', authUserId]}},
                {$expr: {$eq: ['$config.isArchived', isArchived]}},
            ]
        };
        return this.roomAggregate(match, authUserId, take, offset)
    }

    public roomAggregate(match: any, authUserId: Types.ObjectId, take: number, offset: number): Observable<IRoomType[]> {

        const aggregation = this.roomModel.aggregate<IRoomType>([
            {$match: match},

            this.generateUserLookup(),

            this.generateUserProfileLookup(),
            { $unwind: {path: '$profile'} },

            this.generateLastMessageLookup(),
            { $unwind: {path: '$lastMessage', preserveNullAndEmptyArrays: true} },

            this.generateUnreadMessageCountLookup(authUserId),
            { $unwind: {path: '$unreadMessageCount', preserveNullAndEmptyArrays: true} },
            { $set: {'unreadMessageCount': '$unreadMessageCount.count'}}, {
                $project: {
                    'unreadMessageCount': 1,
                    'lastMessage': 1,
                    'chatLink': 1,
                    'config': 1,
                    'profile._id': 1,
                    'profile.user': 1,
                    'profile.name': 1,
                    'profile.avatarPath': 1,
                    'profile.online': 1,
                }
            },

            { $skip: offset },

            { $limit: take },

            { $sort : { 'lastMessage.createdAt' : -1 } }
        ])
        return from(aggregation);
    }

    private generateUserLookup() {
        return {
            $lookup: {
                from: 'users',
                localField: 'toUser',
                foreignField: '_id',
                as: '_user',
            }
        }
    }

    private generateUserProfileLookup() {
        return {
            $lookup: {
                from: 'userprofiles',
                localField: '_user.profile',
                foreignField: '_id',
                as: 'profile',
            }
        }
    }

    private generateLastMessageLookup() {
        return {
            $lookup: {
                from: 'chatmessages',
                let: { "chatLink": "$chatLink" },
                as: 'lastMessage',
                pipeline: [
                    { $match: { $expr: { $eq: ['$chatLink', '$$chatLink'] } }},
                    { $project: { chatLink: 0, __v: 0}},
                    { $sort : { createdAt : -1 }},
                    { $limit: 1 },
                ]
            }
        }
    }

    private generateUnreadMessageCountLookup(userId: Types.ObjectId) {
        return {
            $lookup: {
                from: 'chatmessages',
                let: { "chatLink": "$chatLink" },
                as: 'unreadMessageCount',
                pipeline: [
                    {
                        $match: {
                            $and: [
                                {$expr: {$eq: ['$chatLink', '$$chatLink']}},
                                {$expr: {$eq: ['$toUser', userId]}},
                                {isRead: false},
                            ]

                        }
                    },
                    { $group: { _id: '_id', count: { $sum: 1 } } },
                ]
            }
        }
    }

    public createRoom(authUserId: Types.ObjectId, toUserId: Types.ObjectId, chatLink: string): Observable<ChatRoomDocuments> {
        return of(new this.roomModel({
            user: authUserId,
            toUser: toUserId,
            chatLink: chatLink
        })).pipe(
            switchMap(room => from(room.save()))
        )
    }

    public findRoom(params: FilterQuery<ChatRoomDocuments>, protection = undefined): Observable<ChatRoomDocuments> {
        return MongooseHelpersService.findOneOrError(this.roomModel, params, protection)
    }

    public updateRoomConfig(room: ChatRoomDocuments, config: RoomConfig): Observable<ChatRoomDocuments> {
        room.config = {
            isArchived: (config.isArchived != undefined) ? config.isArchived : room.config.isArchived,
            isMute: (config.isMute != undefined) ? config.isMute : room.config.isMute
        };
        return from(room.save())
    }

    public deleteRoomByParams(param: { chatLink: string }) {
        return from(this.roomModel.deleteMany(param).exec()).pipe(
            map(result => (result.deletedCount >= 0))
        );
    }
}
