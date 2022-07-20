import { SearchParamDto } from '../dto/search-param.dto';
import { Types } from 'mongoose';
import { MainSearchQuery } from '../search.type';
import { LocationDocuments } from '../../addition-data/schemas/location.schema';
import { UserProfileDocuments } from '../../users/user-profile/schemas/userProfile.schema';

export type ChainSearchParams = SearchParamDto & {
    location: LocationDocuments,
    user: Types.ObjectId[],
    host: string,
    userProfile: UserProfileDocuments
}

export interface IChain {

    do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery

    next(requestParams: ChainSearchParams, queryParams: MainSearchQuery, nextChain: IChain | null): MainSearchQuery

}
