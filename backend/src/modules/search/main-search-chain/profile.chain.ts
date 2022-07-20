import { UserProfile } from '../../users/user-profile/schemas/userProfile.schema';
import { plainToClass } from 'class-transformer';
import AgeChain from './age.chain';
import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import { MainSearchQuery } from '../search.type';

export default class ProfileChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {
        const profile = plainToClass(UserProfile, requestParams, { excludeExtraneousValues: true, exposeUnsetFields: false });
        if(Object.keys(profile).length > 0) Object.assign(queryParams.$match, profile);
        return this.next(requestParams, queryParams, new AgeChain());
    }
}
