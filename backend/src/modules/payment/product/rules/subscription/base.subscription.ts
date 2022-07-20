import { IRule } from '../IRule';
import { ModuleRef } from '@nestjs/core';
import { Product, ProductDocument } from '../../product.schema';
import { UsersDocuments } from '../../../../users/schemas/users.schema';
import { from, Observable, of, shareReplay, switchMap } from 'rxjs';
import { TransactionDocument } from '../../../transaction/transaction.schema';
import { PaymentService } from '../../../payment.service';
import { Types } from 'mongoose';
import { MessagesService } from '../../../../chat/messages/messages.service';
import { ISubscription } from './ISubscription';
import { AlbumService } from '../../../../album/album.service';
import { PhotoWithLikes } from '../../../../photo/photo.type';
import { FileService } from '../../../../file/file.service';
import { FileHelperService } from '../../../../helpers/file-helper.service';

export abstract class Subscription implements IRule, ISubscription {

    abstract name;

    protected maxPhotoInAlbum = 9;

    protected readonly paymentService: Observable<PaymentService> =
        from(this.moduleRef.create(PaymentService)).pipe(
            shareReplay(1)
        );

    constructor(
        protected moduleRef: ModuleRef
    ) {}

    public abstract buy(product: ProductDocument, buyer: UsersDocuments): Observable<TransactionDocument | boolean>;

    public deactivate(product: Product, buyer: UsersDocuments): Observable<boolean> {
        let _service: PaymentService;
        return this.paymentService.pipe(
            switchMap(service => {
                _service = service;
                return service.paymentGatewayService.cancelPayment()
            }),
            switchMap(() => _service.deactivateSubscription(buyer._id))
        );
    };

    public firstMessageToChatRoomCheck(service: MessagesService, ownerId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<boolean> {
        return of(true);
    }

    public limitMessageToChatRoomCheck(service: MessagesService, ownerId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<boolean> {
        return of(true);
    }

    public userSearchResult(requestData: { offset: number; take: number }): Observable<{ offset: number; take: number }> {
        return of(requestData);
    }

    public isHaveAccessToAlbum(service: AlbumService, userId: Types.ObjectId, albumId: Types.ObjectId): Observable<boolean> {
        return of(true)
    }

    public isHaveAccessToAlbumByUser(userId: Types.ObjectId, targetId: Types.ObjectId): Observable<boolean> {
        return of(true);
    }

    public checkMaxPhotoUpload(photoCount: number): Observable<boolean> {
        return of((photoCount < this.maxPhotoInAlbum))
    }

    public makeLinkToMdPhoto(photoDoc: PhotoWithLikes, index: number): {url: string, type: string} {

        const fileService = this.moduleRef.get(FileService, {strict: false});

        return {url: fileService.getImgUrl(photoDoc.photoPath, FileHelperService.mediumImgPrefix), type: FileHelperService.mediumImgPrefix};
    }

}
