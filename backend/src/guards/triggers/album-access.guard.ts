import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, switchMap, } from 'rxjs';
import { PaymentService } from '../../modules/payment/payment.service';
import { AuthHelpersService } from '../../modules/helpers/auth-helpers.service';
import { AlbumService } from '../../modules/album/album.service';
import { Types } from 'mongoose';

@Injectable()
export class AlbumAccessGuard implements CanActivate {

    constructor(
        private readonly paymentService: PaymentService,
        public readonly albumService: AlbumService
    ) {}

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const user = AuthHelpersService.getUserDocFromContext(context);

        const albumId = AuthHelpersService.getVariableFromContext<string>(context, 'album_id');

        return this.paymentService.getActiveSubscription(user._id).pipe(
            switchMap(collection => collection.rule.isHaveAccessToAlbum(this.albumService, user._id, Types.ObjectId(albumId)))
        );
    }

}
