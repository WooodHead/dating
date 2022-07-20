import * as request from 'supertest';
import { combineLatest, concatMap, from, map, Observable, of, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { E2eTest } from '../IE2e.test';
import { RegistrationResponse } from '../../src/modules/auth/auth.type';
import { UserFactory } from '../test.factory';
import { AlbumTypeEnum } from '../../src/modules/album/enums/album.enum';
import * as path from 'path';
import { FileService } from '../../src/modules/file/file.service';
import { Types } from 'mongoose';
import { AlbumPhotoFactory } from '../album-photo.factory';

export class AlbumE2e extends E2eTest {

    protected testsDescription = 'Album'

    private albumFactory$: Observable<AlbumPhotoFactory> = of(new AlbumPhotoFactory(this.data$)).pipe(
        shareReplay(1)
    );

    private userWithAlbum$: Observable<RegistrationResponse & {token: string}> = of(new UserFactory(this.data$)).pipe(
        switchMap(factory => factory.createUser()),
        first(),
        shareReplay(1)
    )

    private privateAlbumId$: ReplaySubject<Types.ObjectId> = new ReplaySubject<Types.ObjectId>(1);
    private publicAlbumId$: ReplaySubject<Types.ObjectId> = new ReplaySubject<Types.ObjectId>(1);

    private privatePhotoId$: ReplaySubject<Types.ObjectId> = new ReplaySubject<Types.ObjectId>(1);
    private publicPhotoId$: ReplaySubject<Types.ObjectId> = new ReplaySubject<Types.ObjectId>(1);
    private mainPhotoId$: ReplaySubject<Types.ObjectId> = new ReplaySubject<Types.ObjectId>(1);

    protected tests = [
        {
            name: 'create public album',
            fn: this.createPublicAlbum()
        }, {
            name: 'create private album',
            fn: this.createPrivateAlbum()
        }, {
            name: 'upload photo to private albums',
            fn: this.uploadPhotoToPrivateAlbums()
        }, {
            name: 'upload photo to main photo',
            fn: this.uploadPhotoToMainPhoto()
        }, {
            name: 'upload photo to public albums',
            fn: this.uploadPhotoToPublicAlbums()
        }, {
            name: 'change name and type album',
            fn: this.changeNameAndTypeAlbum()
        }, {
            name: 'check photo in the private album',
            fn: this.checkPhotosInPrivateAlbum()
        }, {
            name: 'check photo in the public album',
            fn: this.checkPhotosInPublicAlbum()
        }, {
            name: 'check main photo',
            fn: this.checkMainPhoto()
        }, {
            name: 'delete photo in public album',
            fn: this.deletePhotoInPublicAlbum()
        }, {
            name: 'delete album',
            fn: this.deletePrivateAlbum()
        }, {
            name: 'delete main photo',
            fn: this.deleteMainPhoto()
        }
    ]

    public createPublicAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$
        }).pipe(
            concatMap(result => from(
                request(result.data.httpServer)
                    .post('/album')
                    .send({name: 'pub', type: AlbumTypeEnum.public})
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .expect(201)
            ).pipe(
                tap(response => expect(response.body._id).toBeDefined()),
                tap(response => this.publicAlbumId$.next(Types.ObjectId(response.body._id))),
                concatMap(() => from(
                    request(result.data.httpServer)
                        .get(`/album/public/${result.user.profile.user}`)
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                )),
                tap(response => expect(response.body.count).toBeGreaterThan(0)),
            ))
        )
    }

    public createPrivateAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$
        }).pipe(
            concatMap(result => from(
                request(result.data.httpServer)
                    .post('/album')
                    .send({name: 'pri', type: AlbumTypeEnum.private})
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .expect(201)
            ).pipe(
                tap(response => expect(response.body._id).toBeDefined()),
                tap(response => this.privateAlbumId$.next(Types.ObjectId(response.body._id))),
                concatMap(() => from(
                    request(result.data.httpServer)
                        .get(`/album/private/${result.user.profile.user}`)
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                )),
                tap(response => expect(response.body.count).toBeGreaterThan(0)),
            )),
        )
    }

    public uploadPhotoToPrivateAlbums(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.privateAlbumId$
        }).pipe(
            concatMap(result => from(
                    request(result.data.httpServer)
                        .post(`/photo/${result.albumId}`)
                        .attach('photo', path.resolve(FileService.storagePath + '/photosExamples/example1.jpg'))
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(201)
                ).pipe(
                    tap(response => expect(response.body.photoId).toBeDefined()),
                    tap(response => this.privatePhotoId$.next(Types.ObjectId(response.body.photoId))),
                    delay(1000),
                )
            )
        )
    }

    public uploadPhotoToMainPhoto(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$
        }).pipe(
            concatMap(result => from(
                    request(result.data.httpServer)
                        .post(`/photo`)
                        .attach('photo', path.resolve(FileService.storagePath + '/photosExamples/example1.jpg'))
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(201)
                ).pipe(
                    tap(response => expect(response.body.photoId).toBeDefined()),
                    tap(response => this.mainPhotoId$.next(Types.ObjectId(response.body.photoId))),
                    delay(1000),
                )
            )
        )
    }

    public uploadPhotoToPublicAlbums(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.publicAlbumId$
        }).pipe(
            concatMap(result => from(
                    request(result.data.httpServer)
                        .post(`/photo/${result.albumId}`)
                        .attach('photo', path.resolve(FileService.storagePath + '/photosExamples/example1.jpg'))
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(201)
                ).pipe(
                    tap(response => expect(response.body.photoId).toBeDefined()),
                    tap(response => this.publicPhotoId$.next(Types.ObjectId(response.body.photoId))),
                    delay(1000),
                )
            )
        )
    }

    public changeNameAndTypeAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.publicAlbumId$,
        }).pipe(
            switchMap(result => from(
                request(result.data.httpServer)
                    .patch(`/album/${result.albumId}`)
                    .send({name: 'name', type: AlbumTypeEnum.private})
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .expect(200)
            ).pipe(
                tap(response => expect(response.body.name).toEqual('name')),
                tap(response => expect(response.body.type).toEqual(AlbumTypeEnum.private)),
            ))
        )
    }

    public checkPhotosInPrivateAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.privateAlbumId$,
            photoId: this.privatePhotoId$
        }).pipe(
            switchMap(result => this.albumFactory$.pipe(
                    switchMap(factory => combineLatest({
                            coverLinks: factory.generateLinksToAlbumsCover(result.albumId),
                            photoLinks: factory.generateLinksToPhotos(result.photoId)
                        }),
                    ),
                    map(combined => ({...combined.coverLinks, ...combined.photoLinks})),
                    concatMap(links => combineLatest({
                        lg: from(request('').get(links.lgPhoto).expect(200)),
                        md: from(request('').get(links.mdPhoto).expect(200)),
                        sm: from(request('').get(links.smPhoto).expect(200)),
                        bg: from(request('').get(links.cover).expect(200)),
                        blurBg: from(request('').get(links.blurCover).expect(200)),
                    }))
                )
            )
        )
    }

    public checkPhotosInPublicAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.publicAlbumId$,
            photoId: this.publicPhotoId$
        }).pipe(
            switchMap(result => this.albumFactory$.pipe(
                    switchMap(factory => combineLatest({
                            coverLinks: factory.generateLinksToAlbumsCover(result.albumId),
                            photoLinks: factory.generateLinksToPhotos(result.photoId)
                        }),
                    ),
                    map(combined => ({...combined.coverLinks, ...combined.photoLinks})),
                    concatMap(links => combineLatest({
                        lg: from(request('').get(links.lgPhoto).expect(200)),
                        md: from(request('').get(links.mdPhoto).expect(200)),
                        sm: from(request('').get(links.smPhoto).expect(200)),
                        bg: from(request('').get(links.cover).expect(200)),
                        blurBg: from(request('').get(links.blurCover).expect(200)),
                    }))
                )
            )
        )
    }

    public checkMainPhoto(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            photoId: this.mainPhotoId$
        }).pipe(
            switchMap(result => this.albumFactory$.pipe(
                    switchMap(factory => factory.generateLinksToPhotos(result.photoId)),
                    concatMap(links => combineLatest({
                        lg: from(request('').get(links.lgPhoto).expect(200)),
                        md: from(request('').get(links.mdPhoto).expect(200)),
                        sm: from(request('').get(links.smPhoto).expect(200)),
                    }))
                )
            )
        )
    }

    public deletePhotoInPublicAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.publicAlbumId$,
            photoId: this.publicPhotoId$
        }).pipe(
            switchMap(result => from(
                request(result.data.httpServer)
                    .delete(`/photo/${result.photoId}`)
                    .set('Authorization', `Bearer ${result.user.token}`)
                    .expect(200)
            ).pipe(
                concatMap(() => from(
                    request(result.data.httpServer)
                        .get(`/album/info/${result.albumId}`)
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                )),
                tap(response => expect(response.body.photos.length).toEqual(0)),
            ))
        )
    }

    public deletePrivateAlbum(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            albumId: this.privateAlbumId$
        }).pipe(
            switchMap(result =>
                from(
                    request(result.data.httpServer)
                        .delete(`/album/${result.albumId}`)
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                ).pipe(
                    delay(500),
                    concatMap(() => from(
                        request(result.data.httpServer)
                            .get(`/album/private/${result.user.profile.user}`)
                            .set('Authorization', `Bearer ${result.user.token}`)
                            .expect(200)
                    )),
                    tap(response => expect(response.body.count).toEqual(1)),
                )
            ),
        )
    }

    public deleteMainPhoto(): Observable<any> {
        return combineLatest({
            data: this.data$,
            user: this.userWithAlbum$,
            photoId: this.mainPhotoId$
        }).pipe(
            switchMap(result => from(
                    request(result.data.httpServer)
                        .delete(`/photo/${result.photoId}`)
                        .set('Authorization', `Bearer ${result.user.token}`)
                        .expect(200)
                )
            )
        )
    }
}

