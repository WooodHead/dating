import { combineLatest, map, Observable, shareReplay, switchMap } from 'rxjs';
import { DataSet } from './app.e2e-spec';
import * as faker from 'faker';
import { FileService } from '../src/modules/file/file.service';
import { FileHelperService } from '../src/modules/helpers/file-helper.service';
import { Types } from 'mongoose';
import { PhotoService } from '../src/modules/photo/photo.service';
import { AlbumService } from '../src/modules/album/album.service';

export type PhotoLinks = {
    lgPhoto: string,
    mdPhoto: string,
    smPhoto: string
}

export type CoverLinks = {
    cover: string,
    blurCover: string
}

export class AlbumPhotoFactory {

    private fileService$: Observable<FileService> = this.data$.pipe(
        map(data => data.moduleRef.get<FileService>(FileService)),
        shareReplay(1)
    )

    private photoService$: Observable<PhotoService> = this.data$.pipe(
        map(data => data.moduleRef.get<PhotoService>(PhotoService)),
        shareReplay(1)
    )

    private albumService$: Observable<AlbumService> = this.data$.pipe(
        map(data => data.moduleRef.get<AlbumService>(AlbumService)),
        shareReplay(1)
    )

    constructor(
        private readonly data$: Observable<DataSet>
    ) {}

    public generateRandPhoto(): Observable<Buffer> {
        return this.fileService$.pipe(
            switchMap(fileService => fileService.takeImgBufferFromRawData(`example${faker.random.number({
                'min': 1,
                'max': 5
            })}.jpg`, FileService.storagePath, 'photosExamples'))
        )
    }

    public generateLinksToPhotos(photoId: Types.ObjectId): Observable<PhotoLinks> {
        return this.photoService$.pipe(
            switchMap(photoService => combineLatest({
                fileService: this.fileService$,
                photoDocument: photoService.getPhoto({_id: photoId})
            })),
            map(data => ({
                lgPhoto: data.fileService.getImgUrl(data.photoDocument.photoPath, FileHelperService.largeImgPrefix),
                mdPhoto: data.fileService.getImgUrl( data.photoDocument.photoPath, FileHelperService.mediumImgPrefix),
                smPhoto: data.fileService.getImgUrl(data.photoDocument.photoPath, FileHelperService.smallImgPrefix)
            }))
        )
    }

    public generateLinksToAlbumsCover(albumId: Types.ObjectId): Observable<CoverLinks> {
        return this.albumService$.pipe(
            switchMap(albumService => combineLatest({
                fileService: this.fileService$,
                albumDocument: albumService.findAlbumByParams({_id: albumId})
            })),
            map(data => ({
                cover: data.fileService.getImgUrl(data.albumDocument.titlePhoto, FileHelperService.titleImgPrefix),
                blurCover: data.fileService.getImgUrl(data.albumDocument.titlePhoto, FileHelperService.titleBlurImgPrefix)
            }))
        )
    }
}
