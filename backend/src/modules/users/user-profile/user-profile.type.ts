import { UserProfileDocuments } from './schemas/userProfile.schema';
import { RegistrationResponse } from '../../auth/auth.type';
import { LikesCount } from '../../like/like.type';
import { Purchase, PurchaseDocument } from '../../payment/purchase/purchase.schema';
import { Types } from 'mongoose';

export type AuthUserProfile = {
    likes: LikesCount,
    subscription: PurchaseDocument | Purchase
} & RegistrationResponse;

export type OtherUserProfile = {
    profile: UserProfileDocuments & any,
    distance: number | string,
    likes: {
        like: number,
        heart: number,
        isUserPutLike: boolean,
        isUserPutHeart: boolean
    },
    relations: {
        to: string,
        from: string
    },
    chatLink: string
}

export type bootProfile = {
    profile: UserProfileDocuments,
    distance: number
}

export type DatasetForBootProfile = {
    distance: number,
    locationId: Types.ObjectId
}
