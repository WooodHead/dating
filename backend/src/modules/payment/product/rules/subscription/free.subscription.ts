import { Product, ProductDocument } from '../../product.schema';
import { UsersDocuments } from '../../../../users/schemas/users.schema';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { UnprocessableEntityException } from '@nestjs/common';
import { MessagesService } from '../../../../chat/messages/messages.service';
import { Types } from 'mongoose';
import { SubscriptionEnum } from '../../product.enum';
import { Subscription } from './base.subscription';
import { AlbumService } from '../../../../album/album.service';
import { catchError } from 'rxjs/operators';
import { PhotoWithLikes } from '../../../../photo/photo.type';
import { FileService } from '../../../../file/file.service';
import { FileHelperService } from '../../../../helpers/file-helper.service';

export class FreeSubscription extends Subscription {

    public name = SubscriptionEnum.free;

    protected maxPhotoInAlbum = 1;

    public static readonly searchResultCountTake = 12;
    public static readonly searchResultCountOffset = 0;

    public buy(product: ProductDocument, buyer: UsersDocuments): Observable<boolean> {
        return this.paymentService.pipe(
            switchMap(service => service.getActiveSubscription(buyer._id)),
            switchMap(collection => (collection.subscription.product.name == SubscriptionEnum.free)
                ? throwError(() => new UnprocessableEntityException('Subscription already bought'))
                : collection.rule.deactivate(collection.subscription.product, buyer).pipe(
                    switchMap(result => (result)
                        ? of(null)
                        : throwError(() => new UnprocessableEntityException('something went wrong'))
                    )
                )
            )
        );
    }

    public userSearchResult(requestData: { offset: number; take: number }): Observable<{ offset: number; take: number }> {
        return of({offset: FreeSubscription.searchResultCountOffset, take: (requestData.take < FreeSubscription.searchResultCountTake) ? requestData.take : FreeSubscription.searchResultCountTake});
    }

    public firstMessageToChatRoomCheck(service: MessagesService, ownerId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<boolean> {
        return service.countMessagesByUser(targetUserId, ownerId).pipe(
            map(result => (result != 0))
        )
    }

    public limitMessageToChatRoomCheck(service: MessagesService, ownerId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<boolean> {
        return service.countMessagesByUser(ownerId, targetUserId).pipe(
            map(result => (result == 0))
        )
    }

    public isHaveAccessToAlbum(service: AlbumService, userId: Types.ObjectId, albumId: Types.ObjectId): Observable<boolean> {
        return service.findAlbumByParams({_id: albumId, belongTo: userId}).pipe(
            map(() => true),
            catchError(e => of(false))
        )
    }

    public isHaveAccessToAlbumByUser(userId: Types.ObjectId, targetId: Types.ObjectId): Observable<boolean> {
        return of((String(userId) == String(targetId)))
    }

    public deactivate(product: Product, buyer: UsersDocuments): Observable<boolean> {
        return of(true);
    }

    public makeLinkToMdPhoto(photoDoc: PhotoWithLikes, index: number): {url: string, type: string} {

        const fileService = this.moduleRef.get(FileService, {strict: false});

        return (index == 0)
            ? {url: fileService.getImgUrl(photoDoc.photoPath, FileHelperService.mediumImgPrefix), type: FileHelperService.mediumImgPrefix}
            : {url: fileService.getImgUrl(photoDoc.photoPath, FileHelperService.mediumBlurImgPrefix), type: FileHelperService.mediumBlurImgPrefix}

    }
}
