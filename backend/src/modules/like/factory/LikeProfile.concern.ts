import { Model, Types } from 'mongoose';
import { combineLatest, from, map, Observable } from 'rxjs';
import { LikeTargetObjectEnum, LikeTypeEnum } from '../like.enum';
import { LikeDocuments } from '../like.schema';
import { IsUserPutLike, LikesCount, ProfileLike } from '../like.type';

export class LikeProfileConcern {

    constructor(
        private likeModel: Model<LikeDocuments>
    ) {}

    public putLike(like: ProfileLike): Observable<LikeDocuments> {
        return from(this.likeModel.create({...like, object: LikeTargetObjectEnum.profile}));
    }

    public countLikes(targetUserId: Types.ObjectId): Observable<LikesCount> {
        return combineLatest({
            like: from(this.likeModel.countDocuments({
                targetId: targetUserId,
                type: LikeTypeEnum.like,
                object: LikeTargetObjectEnum.profile
            }).exec()),
            heart: from(this.likeModel.countDocuments({
                targetId: targetUserId,
                type: LikeTypeEnum.heart,
                object: LikeTargetObjectEnum.profile
            }).exec()),
        });
    }

    public isUserPutLike(targetUserId: Types.ObjectId, ownerUserId: Types.ObjectId): Observable<IsUserPutLike> {
        return combineLatest({
            isUserPutLike: from(this.likeModel.countDocuments({
                targetId: targetUserId,
                type: LikeTypeEnum.like,
                object: LikeTargetObjectEnum.profile,
                ownerId: ownerUserId
            }).exec()).pipe(
                map(result => !!(result))
            ),
            isUserPutHeart: from(this.likeModel.countDocuments({
                targetId: targetUserId,
                type: LikeTypeEnum.heart,
                object: LikeTargetObjectEnum.profile,
                ownerId: ownerUserId
            }).exec()).pipe(
                map(result => !!(result))
            ),
        });
    }
}
