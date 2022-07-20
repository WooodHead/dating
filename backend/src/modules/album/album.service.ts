import { Injectable } from '@nestjs/common';
import { Album, AlbumDocuments } from './schemas/album.schema';
import { concatMap, from, last, mapTo, Observable, of, switchMap, switchMapTo } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { AlbumTypeEnum } from './enums/album.enum';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { PhotoService } from '../photo/photo.service';
import { FileService } from '../file/file.service';
import { AlbumSharePermissionDocuments } from './album-share/album-share-permission.schema';

type AggregatePrivateAlbum = AlbumDocuments & {
    share: AlbumSharePermissionDocuments,
    sharePermission: Date
}

@Injectable()
export class AlbumService {

    constructor(
        @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocuments>,
        private readonly photoService: PhotoService,
        private readonly fileService: FileService,
    ) {}

    public createNewAlbum(data: { ownerId: Types.ObjectId, name: string, type: AlbumTypeEnum }): Observable<AlbumDocuments> {
        return of(new this.albumModel({
            belongTo: data.ownerId,
            type: data.type,
            name: data.name
        })).pipe(
            switchMap(model => model.save())
        )
    }

    public findAlbumByParams(params: FilterQuery<AlbumDocuments>, filter = undefined): Observable<AlbumDocuments> {
        return MongooseHelpersService.findOneOrError(this.albumModel, params, filter);
    }

    public findAlbumsByParams(params: any, offset = 0, limit = 5, filter = {}): Observable<AlbumDocuments[]> {
        return from(
            this.albumModel.aggregate([
                {$match: params},
                {$project: filter},
                {$skip: offset},
                {$limit: limit},
            ])
        );
    }

    public findPrivateAlbums(ownerId: Types.ObjectId, requestUserId: Types.ObjectId, take: number, offset: number): Observable<AggregatePrivateAlbum[]> {
        const query = this.albumModel.aggregate<AggregatePrivateAlbum>([
            {
                $match: {type: AlbumTypeEnum.private, belongTo: ownerId}
            },
            {
                $lookup: {
                    from: 'albumsharepermissions',
                    let: {album: '$_id'},
                    pipeline: [
                        {
                            $match: {$expr: {$and: [{$eq: ['$targetUserId', requestUserId]}, {$eq: ['$albumId', '$$album']}]}}
                        }
                    ],
                    as: 'share'
                }
            },
            {$unwind: {path: '$share', preserveNullAndEmptyArrays: true}},
            {$addFields: {sharePermission: '$share.createdAt'}},
            {
                $project: {
                    share: 0
                }
            },
            {$sort: {sharePermission: -1, updatedAt: 1}},
            {$skip: offset},
            {$limit: take},
        ])
        return from(query);
    }

    public deleteAlbum(album: AlbumDocuments): Observable<boolean> {
        return this.photoService.
        getPhotos({album: album.id}).pipe(
            switchMap(photos => (photos.length) ? from(photos) : of(null)),
            concatMap(photo => (photo) ? this.photoService.deletePhoto(photo) : of(true)),
            last(),
            switchMapTo(this.fileService.deleteAlbumTitlePhoto(album.titlePhoto)),
            switchMapTo(album.remove()),
            mapTo(true)
        )
    }

    public countAlbums(params: FilterQuery<AlbumDocuments>): Observable<number> {
        return from(this.albumModel.find(params).countDocuments().exec())
    }
}
