import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable, switchMap, } from 'rxjs';
import { AlbumShareService } from '../modules/album/album-share/album-share.service';
import { AlbumService } from '../modules/album/album.service';

@Injectable()
export class AccessToAlbumPhotoGuard implements CanActivate {

    public constructor(
        private readonly albumShareService: AlbumShareService,
        private readonly albumService: AlbumService,
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authUser = context.switchToHttp().getRequest().user;
        if (!authUser) throw new ForbiddenException();
        return this.albumService.findAlbumByParams({_id: context.switchToHttp().getRequest().params.album_id}).pipe(
            switchMap(album => this.albumShareService.isHaveAccess(authUser._id, album))
        )
    }

}
