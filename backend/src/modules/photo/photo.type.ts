import { Types } from 'mongoose';
import { LikeTypeEnum } from '../like/like.enum';

export type PhotoWithLikes = {
    _id: Types.ObjectId,
    photoPath: string,
    likes: { type: LikeTypeEnum, ownerId: Types.ObjectId }[]
}
