import { Observable } from 'rxjs';
import { MessagesService } from '../../../../chat/messages/messages.service';
import { Types } from 'mongoose';
import { AlbumService } from '../../../../album/album.service';
import { PhotoWithLikes } from '../../../../photo/photo.type';

export interface ISubscription {

    userSearchResult(requestData: { offset: number, take: number }): Observable<{ offset: number, take: number }>

    firstMessageToChatRoomCheck(service: MessagesService, ownerId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<boolean>

    limitMessageToChatRoomCheck(service: MessagesService, ownerId: Types.ObjectId, targetUserId: Types.ObjectId): Observable<boolean>

    isHaveAccessToAlbum(service: AlbumService, userId: Types.ObjectId, albumId: Types.ObjectId): Observable<boolean>

    isHaveAccessToAlbumByUser(userId: Types.ObjectId, targetId: Types.ObjectId): Observable<boolean>

    checkMaxPhotoUpload(photoCount: number): Observable<boolean>

    makeLinkToMdPhoto(photoDoc: PhotoWithLikes, index: number): {url: string, type: string}
}
