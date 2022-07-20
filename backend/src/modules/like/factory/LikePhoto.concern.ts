import { Model, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { LikeDocuments } from '../like.schema';
import { LikeTargetObjectEnum, LikeTypeEnum } from '../like.enum';
import { PhotoWithLikes } from '../../photo/photo.type';
import { IsUserPutLike, LikesCount, PhotoLike } from '../like.type';

export class LikePhotoConcern {

    constructor(private likeModel: Model<LikeDocuments>) {}

    public putLike(like: PhotoLike): Observable<LikeDocuments> {
        return from(this.likeModel.create({...like, object: LikeTargetObjectEnum.photo}));
    }

    public countLikes(arrWithLikes: PhotoWithLikes, ownerUser: Types.ObjectId): LikesCount & IsUserPutLike {
        let likes = 0;
        let hearts = 0;

        let isUserPutLike = false;
        let isUserPutHeart = false;

        arrWithLikes.likes.forEach(like => {

            if (like.type == LikeTypeEnum.like && String(like.ownerId) == String(ownerUser)) isUserPutLike = true;
            if (like.type == LikeTypeEnum.heart && String(like.ownerId) == String(ownerUser)) isUserPutHeart = true;

            if (like.type == LikeTypeEnum.like) likes++
            if (like.type == LikeTypeEnum.heart) hearts++
        })

        return {like: likes, heart: hearts, isUserPutLike, isUserPutHeart}
    }
}
