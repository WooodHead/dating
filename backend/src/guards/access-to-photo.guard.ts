import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable, of, switchMap, } from 'rxjs';
import { AlbumShareService } from '../modules/album/album-share/album-share.service';
import { PhotoService } from '../modules/photo/photo.service';
import { AlbumService } from '../modules/album/album.service';

@Injectable()
export class AccessToPhotoGuard implements CanActivate {

    public constructor(
        private readonly albumShareService: AlbumShareService,
        private readonly photoService: PhotoService,
        private readonly albumService: AlbumService,
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authUser = context.switchToHttp().getRequest().user;
        const photoId =  context.switchToHttp().getRequest().params.photoId;

        if(!authUser) throw new ForbiddenException();
        return this.photoService.getPhoto({_id: photoId}).pipe(
            switchMap(photo => (photo.album)
                ? this.albumService.findAlbumByParams({_id: photo.album}).pipe(
                    switchMap(album => this.albumShareService.isHaveAccess(authUser._id, album))
                )
                : of(true))
        );
    }

}
