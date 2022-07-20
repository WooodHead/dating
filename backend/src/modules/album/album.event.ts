import { AlbumDocuments } from './schemas/album.schema';
import { AlbumSharePermissionDocuments } from './album-share/album-share-permission.schema';
import { Types } from 'mongoose';

export class AlbumShareEvent {

    public static eventName = 'album.share';

    public constructor(
        public permission: AlbumSharePermissionDocuments,
        public album: AlbumDocuments
    ) {}
}

export class AlbumRequestEvent {

    public static eventName = 'album.request';

    public constructor(
        public album: AlbumDocuments,
        public fromUserId: Types.ObjectId
    ) {}
}
