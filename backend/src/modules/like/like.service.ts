import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Like, LikeDocuments } from './like.schema';
import { LikeProfileConcern } from './factory/LikeProfile.concern';
import { LikePhotoConcern } from './factory/LikePhoto.concern';
import { combineLatest, from, Observable, of } from 'rxjs';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { LikeResponse } from './like.type';

@Injectable()
export class LikeService {

    public profile: LikeProfileConcern;
    public photo: LikePhotoConcern;

    constructor(
        @InjectModel(Like.name) private readonly likeModel: Model<LikeDocuments>,
    ) {
        this.profile = new LikeProfileConcern(likeModel);
        this.photo = new LikePhotoConcern(likeModel);
    }

    public findLikeOrNullByParams(params: FilterQuery<LikeDocuments>, projection: any = undefined): Observable<LikeDocuments | null> {
        return MongooseHelpersService.findOne(this.likeModel, params, projection);
    }

    public deleteLike(likeId: Types.ObjectId): Observable<any> {
        return from(this.likeModel.deleteOne({_id: likeId}));
    }

    public likesByProfile(profile: UserProfileDocuments, authUserId: Types.ObjectId | null): Observable<LikeResponse> {
        return combineLatest({
            count: this.profile.countLikes(profile.user),
            likeRelation: (authUserId) ? this.profile.isUserPutLike(profile.user, authUserId) : of({
                isUserPutLike: false,
                isUserPutHeart: false,
            })
        })
    }
}
