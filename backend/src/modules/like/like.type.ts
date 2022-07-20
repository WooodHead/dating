import { Types } from 'mongoose';
import { LikeTypeEnum } from './like.enum';

export type LikesCount = {
    like: number,
    heart: number
}

export type IsUserPutLike = {
    isUserPutLike: boolean,
    isUserPutHeart: boolean,
}

export type LikeResponse = {
    count: LikesCount,
    likeRelation: IsUserPutLike
}

export type ProfileLike = {

    ownerId: Types.ObjectId;

    targetId: Types.ObjectId;

    type: LikeTypeEnum;
}

export type PhotoLike = {

    ownerId: Types.ObjectId;

    targetId: Types.ObjectId;

    photoId: Types.ObjectId;

    type: LikeTypeEnum;
}
