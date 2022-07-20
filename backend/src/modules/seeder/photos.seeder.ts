import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { User, UsersDocuments } from '../users/schemas/users.schema';
import { combineLatest, concatMap, delay, from, last, lastValueFrom, map, Observable, of, } from 'rxjs';
import { FileService } from '../file/file.service';
import * as faker from 'faker';
import { PhotoService } from '../photo/photo.service';
import { AlbumService } from '../album/album.service';
import { AlbumTypeEnum } from '../album/enums/album.enum';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import * as path from 'path';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { AlbumDocuments } from '../album/schemas/album.schema';
import { PhotoDocuments } from '../photo/schemas/photo.schema';

export type MainData = {
    photos: Buffer[],
    privateAlbum: AlbumDocuments,
    publicAlbum: AlbumDocuments,
    user: UsersDocuments & { profile: UserProfileDocuments }
}

export type SortedPhotoByAlbums = {
    mainPhoto: { result: Buffer[]; offset: number },
    privatePhoto: { result: Buffer[]; offset: number },
    publicPhoto: { result: Buffer[]; offset: number }
}

@Injectable()
export class PhotosSeeder implements Seeder {
    constructor(
        @InjectModel(User.name) private readonly user: Model<User>,
        private readonly fileService: FileService,
        private readonly photoService: PhotoService,
        private readonly albumService: AlbumService,
    ) {}

    async seed(): Promise<any> {

        const users = await this.user.find().exec();

        const observe$ = from(users).pipe(
            concatMap(user =>
                MongooseHelpersService.wrapPopulate(user, ['profile']),
            ),
            concatMap((user: UsersDocuments & { profile: UserProfileDocuments }) =>
                combineLatest({
                    photos: this.getBuffersOfPhotos(user.profile.name),
                    privateAlbum: this.createAlbum(user._id, AlbumTypeEnum.private),
                    publicAlbum: this.createAlbum(user._id, AlbumTypeEnum.public),
                    user: of(user),
                }),
            ),
            map((data: MainData) => {
                const photoByAlbum = this.splitPhotosByAlbums(data.photos);
                return {...data, ...photoByAlbum};
            }),
            concatMap((data: MainData & SortedPhotoByAlbums) =>
                combineLatest({

                    mainPhoto: this.uploadPhotos(data.mainPhoto.result, data.user._id),

                    publicPhoto: this.uploadPhotos(
                        data.publicPhoto.result,
                        data.user._id,
                        data.publicAlbum._id,
                    ),

                    privatePhoto: this.uploadPhotos(
                        data.privatePhoto.result,
                        data.user._id,
                        data.privateAlbum._id,
                    ),
                }),
            )
        )
        return await lastValueFrom(observe$.pipe(delay(2000)));
    }

    private splitPhotosByAlbums(photos: Buffer[]): SortedPhotoByAlbums {

        const mainPhoto = this.splitBuffers(photos);

        const privatePhoto = this.splitBuffers(photos, mainPhoto.offset);

        const publicPhoto = this.splitBuffers(photos, privatePhoto.offset);

        return {
            mainPhoto, privatePhoto, publicPhoto
        };
    }

    private splitBuffers(array: Buffer[], offset = 0): { result: Buffer[]; offset: number } {

        const number = Math.ceil(array.length / 3);

        const result = array.slice(offset, offset + number);

        return {result, offset: offset + number};
    }

    private uploadPhotos(
        buffers: Buffer[],
        userId: Types.ObjectId,
        albumId: Types.ObjectId = undefined,
    ): Observable<PhotoDocuments | null> {

        if (!buffers.length) return of(null);

        return from(buffers).pipe(
            concatMap(buffer => this.photoService.uploadPhotoToS3(userId, buffer, albumId)),
            last()
        )
    }

    private createAlbum(
        userId: Types.ObjectId,
        type: AlbumTypeEnum,
    ): Observable<AlbumDocuments> {
        return this.albumService.createNewAlbum({
            ownerId: userId,
            name: faker.lorem.word(),
            type,
        });
    }

    async drop(): Promise<any> {
        return undefined;
    }

    private getBuffersOfPhotos(name: string): Observable<any> {
        return this.fileService.readDirectory(path.resolve(FileService.storagePath, 'usersPhotoExamples', name)).pipe(
            concatMap(arrWithPath => combineLatest(
                arrWithPath.map(path => this.fileService.takeImgBufferFromRawData('', '', path))
            )),
        )
    }
}
