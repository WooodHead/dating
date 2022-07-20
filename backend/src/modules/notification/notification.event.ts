import { NotificationsDocuments } from './schemas/notification.schema';
import { Types } from 'mongoose';

export class MessageSendNotificationEvent {

    public static eventName = 'message.send.notification';

    public constructor(
        public notification: NotificationsDocuments
    ) {}
}

export class AlbumSharePermissionNotificationEvent {

    public static eventName = 'album.share.notification';

    public constructor(
        public notification: NotificationsDocuments
    ) {}
}

export class RequestSharePermissionNotificationEvent {

    public static eventName = 'album.request.notification';

    public constructor(
        public notification: NotificationsDocuments
    ) {}
}

export class MessageReadNotificationEvent {

    public static eventName = 'message.read.notification';

    public constructor(
        public userId: Types.ObjectId,
        public notificationsIds: Types.ObjectId[]
    ) {}
}
