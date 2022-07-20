import { Injectable } from '@nestjs/common';
import { from, map, Observable, of, tap } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlbumSharePermission, AlbumSharePermissionDocuments } from './album-share-permission.schema';
import { AlbumDocuments } from '../schemas/album.schema';
import { AlbumShareEvent } from '../album.event';
import { AlbumTypeEnum } from '../enums/album.enum';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';

type UserResponse = {
    _id: string,
    albumCount: number,
    profile: {
        avatarPath: string,
        smAvatarPath: string,
        name: string,
        user: string
    }
}

@Injectable()
export class AlbumShareService {

    constructor(
        @InjectModel(AlbumSharePermission.name) private readonly albumSharePermissionModel: Model<AlbumSharePermissionDocuments>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    public createSharePermissionToAlbum(userFrom: Types.ObjectId, userTo: Types.ObjectId, album: AlbumDocuments): Observable<AlbumSharePermissionDocuments> {
        return from(this.albumSharePermissionModel.create({
            userId: userFrom,
            targetUserId: userTo,
            albumId: album._id
        })).pipe(
            tap((permission) => this.eventEmitter.emit(AlbumShareEvent.eventName, new AlbumShareEvent(permission, album))),
        );
    }

    public deleteSharePermission(userFrom: Types.ObjectId, userTo: Types.ObjectId, albumId: Types.ObjectId): Observable<boolean> {
        return from(this.albumSharePermissionModel.deleteOne({
            userId: userFrom,
            targetUserId: userTo,
            albumId
        }).exec()).pipe(
            map(result => (result.deletedCount > 0))
        );
    }

    public deleteSharePermissions(filter: FilterQuery<AlbumSharePermissionDocuments>): Observable<boolean> {
        return from(this.albumSharePermissionModel.deleteMany(filter).exec()).pipe(
            map(result => (result.deletedCount > 0))
        );
    }

    public isHaveAccess(targetUserId: Types.ObjectId, album: AlbumDocuments): Observable<boolean> {
        if ((album.type != AlbumTypeEnum.private) || String(album.belongTo) == String(targetUserId)) return of(true);
        return this.countAccessRow(album._id, targetUserId).pipe(map(result => (result > 0)));
    }

    public countAccessRow(albumId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<number> {
        return from(this.albumSharePermissionModel.countDocuments({albumId, targetUserId}).exec());
    }

    public userShare(userId: Types.ObjectId): Observable<UserResponse[]> {
        const query = this.albumSharePermissionModel.aggregate<UserResponse>([
            {
                $match: {userId},
            },
            {
                $group: {
                    _id: '$targetUserId',
                    albumCount: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'userprofiles', localField: '_id', foreignField: 'user', as: 'profile'
                }
            },
            {$unwind: {path: '$profile'}},
            this.project()
        ]);
        return from(query);
    }

    public getSharePermissionsByParams(params: FilterQuery<AlbumSharePermissionDocuments>, filter = undefined): Observable<AlbumSharePermissionDocuments[]> {
        return from(this.albumSharePermissionModel.find(params, filter).exec())
    }

    public getSharePermissionByParams(params: FilterQuery<AlbumSharePermissionDocuments>, filter = undefined): Observable<AlbumSharePermissionDocuments> {
        return MongooseHelpersService.findOneOrError(this.albumSharePermissionModel, params, filter);
    }

    public toUserShare(userId: Types.ObjectId): Observable<UserResponse[]> {
        const query = this.albumSharePermissionModel.aggregate<UserResponse>([
            {
                $match: {targetUserId: userId},
            },
            {
                $group: {
                    _id: '$userId',
                    albumCount: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'userprofiles', localField: '_id', foreignField: 'user', as: 'profile'
                }
            },
            {$unwind: {path: '$profile'}},
            this.project()
        ]);
        return from(query);
    }

    private project(): any {
        return {
            $project: {
                _id: 1,
                albumCount: 1,
                'profile.avatarPath': 1,
                'profile.smAvatarPath': 1,
                'profile.name': 1,
                'profile.user': 1
            }
        }
    }
}
