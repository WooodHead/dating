import { Types } from 'mongoose';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';

export type FrontFormatMessagesNotification = {
    _id: Types.ObjectId,
    profile: UserProfileDocuments,
    chatLink: string,
    createdAt: Date
}
export type FrontFormatAlbumShareNotification = {
    _id: Types.ObjectId,
    profile: UserProfileDocuments,
    album: {
        _id: string,
        name: string
    },
    createdAt: Date
}
