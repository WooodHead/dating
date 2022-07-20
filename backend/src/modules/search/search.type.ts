import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { LikeResponse } from '../like/like.type';

export type MainSearchQuery = {
    $match: {[key: string]: any},
    $geoNear?: {[key: string]: any},
    $addFields?: {[key: string]: any},
    $sort?: {[key: string]: any},
}

export type SearchResponseType = {
    profile: UserProfileDocuments,
    distance: number | string,
    likes: LikeResponse
}
