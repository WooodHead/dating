import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { FilterQuery, Model, Types } from 'mongoose';
import { from, map, mapTo, Observable, of, switchMap, switchMapTo, tap } from 'rxjs';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { Photo, PhotoDocuments } from './schemas/photo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FileHelperService } from '../helpers/file-helper.service';
import S3Adapter from '../file/adapter/S3.adapter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PhotoCreateEvent } from './events/photo-create.event';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { PhotoWithLikes } from './photo.type';

@Injectable()
export class PhotoService {

    public constructor(
        private readonly fileService: FileService,
        private readonly profileService: UserProfileService,
        private readonly eventEmitter: EventEmitter2,
        @InjectModel(Photo.name) private readonly photoModel: Model<PhotoDocuments>,
    ) {}

    public getPhoto(params: FilterQuery<PhotoDocuments>, filter = undefined): Observable<PhotoDocuments> {
        return MongooseHelpersService.findOneOrError(this.photoModel, params, filter);
    }

    public getPhotos(params: FilterQuery<PhotoDocuments>, filter = undefined): Observable<PhotoDocuments[]> {
        return from(this.photoModel.find(params, filter).exec());
    }

    public getPhotosWithLikes(params: FilterQuery<PhotoDocuments>): Observable<PhotoWithLikes[]> {
        const query = this.photoModel.aggregate<PhotoWithLikes>([
            {$match: params},
            {
                $lookup:
                    {
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'photoId',
                        as: 'likes'
                    }
            },
            {
                $project: {
                    _id: 1,
                    photoPath: 1,
                    'likes.type': 1,
                    'likes.ownerId': 1,
                }
            },
        ]);

        return from(query);
    }

    public uploadPhotoToS3(userId: Types.ObjectId, bufferImg: Buffer, albumId: Types.ObjectId = undefined): Observable<PhotoDocuments> {
        return this.fileService.uploadImg(bufferImg, S3Adapter.photoBucket, String(userId), FileHelperService.createFileName('jpg')).pipe(
            switchMap(path => this.createPhotoDocument(userId, path, albumId))
        );
    }

    public createPhotoDocument(userId: Types.ObjectId, pathToFile: string, album: Types.ObjectId = undefined): Observable<PhotoDocuments> {
        return of(new this.photoModel({
            photoPath: pathToFile,
            belongTo: userId,
        })).pipe(
            map(photo => {
                if (album) photo.album = album;
                return photo;
            }),
            switchMap(photo => photo.save()),
            tap(photo => this.eventEmitter.emit(PhotoCreateEvent.eventName, new PhotoCreateEvent(photo)))
        )
    }

    public deleteUsersAvatar(userId: Types.ObjectId): Observable<boolean> {
        return this.profileService.findProfileByParam({user: userId}).pipe(
            switchMap(profile => {
                if (profile.originalAvatarPath) return this.fileService.deleteImg(profile.originalAvatarPath);
                return of(false);
            }),
            switchMapTo(this.profileService.updateUserProfile(userId, {
                avatarPath: null,
                smAvatarPath: null,
                originalAvatarPath: null
            })),
            mapTo(true)
        )
    }

    public deletePhoto(photo: PhotoDocuments): Observable<boolean> {
        return of(photo).pipe(
            switchMap(photo => this.fileService.deleteImg(photo.photoPath)),
            switchMapTo(photo.remove()),
            mapTo(true)
        )
    }

    public countPhotoByAlbum(userId: Types.ObjectId, albumId: Types.ObjectId = null): Observable<number> {
        return from(this.photoModel.countDocuments({
            $and: [
                {belongTo: userId},
                {album: (albumId) ?? {$exists: false}}

            ]
        }).exec())
    }
}
