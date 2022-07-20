import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { combineLatest, Observable, of, switchMap, throwError, } from 'rxjs';
import { PhotoService } from '../../modules/photo/photo.service';
import { AuthHelpersService } from '../../modules/helpers/auth-helpers.service';
import { PaymentService } from '../../modules/payment/payment.service';
import { Types } from 'mongoose';

@Injectable()
export class PhotoCountGuard implements CanActivate {

    public constructor(
        private readonly photoService: PhotoService,
        private readonly paymentService: PaymentService
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authUser = AuthHelpersService.getUserDocFromContext(context);

        let albumId: Types.ObjectId;

        try {
            const _var = AuthHelpersService.getVariableFromContext<string>(context, 'albumId');
            albumId = Types.ObjectId(_var)
        } catch (e) {
            albumId = undefined;
        }

        return combineLatest({
            count: this.photoService.countPhotoByAlbum(authUser._id, albumId),
            subscribing: this.paymentService.getActiveSubscription(authUser._id)
        }).pipe(
            switchMap(data => data.subscribing.rule.checkMaxPhotoUpload(data.count)),
            switchMap(result => (result) ? of(true) : throwError(() => new HttpException('too much photo', HttpStatus.NOT_ACCEPTABLE)))
        )
    }

}
