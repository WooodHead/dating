import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PhotoCreateEvent } from '../../photo/events/photo-create.event';
import { map, of, switchMap } from 'rxjs';
import { AlbumService } from '../album.service';
import { first } from 'rxjs/operators';
import { PhotoDeletedEvent } from '../../photo/events/photo-deleted.event';
import { FileService } from '../../file/file.service';
import { PhotoService } from '../../photo/photo.service';

@Injectable()
export class AlbumListener {

    constructor(
        private readonly albumService: AlbumService,
        private readonly fileService: FileService,
        private readonly photoService: PhotoService,
    ) {}

    @OnEvent(PhotoCreateEvent.eventName)
    public photoCreated(event: PhotoCreateEvent) {
        if (!event.photo.album) return 0;
        this.albumService.findAlbumByParams({_id: event.photo.album}).pipe(
            switchMap(album => this.fileService.uploadAlbumTitlePhoto(event.photo.photoPath, album).pipe(map(title => {
                return {album, title}
            }))),
            map(data => {
                data.album.photos.push(event.photo._id)
                data.album.titlePhoto = data.title;
                return data.album;
            }),
            switchMap(album => album.save()),
            first()
        ).subscribe()
    }

    @OnEvent(PhotoDeletedEvent.eventName)
    public photoDelete(event: PhotoDeletedEvent) {
        if (!event.photo.album) return 0;
        this.albumService.findAlbumByParams({_id: event.photo.album}).pipe(
            map(album => {
                album.photos.forEach((val, index) => {
                    if (String(val) == String(event.photo._id)) album.photos.splice(index, 1);
                })
                return album;
            }),
            switchMap(album => (album.photos.length)
                ? this.photoService.getPhoto({_id: album.photos[album.photos.length - 1]}).pipe(map(photo => {
                    return {album, photo: photo}
                }))
                : of({album, photo: null})
            ),
            switchMap(data => (data.photo) ? this.fileService.uploadAlbumTitlePhoto(data.photo.photoPath, data.album).pipe(map(title => {
                return {album: data.album, title}
            })) : of({album: data.album, title: null})),
            map(data => {
                data.album.titlePhoto = data.title;
                return data.album;
            }),
            switchMap(album => album.save()),
            first()
        ).subscribe()
    }

}
