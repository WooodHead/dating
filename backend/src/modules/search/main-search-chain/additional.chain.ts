import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import * as moment from 'moment'
import UserDataChain from './userData.chain';
import { MainSearchQuery } from '../search.type';


export default class AdditionalChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {

        if (requestParams.isRegisterIn15Days) {
            queryParams.$match.createdAt = {
                $gte: moment().subtract(15, 'days').toDate(),
                $lt: moment().toDate()
            };
        }

        if (requestParams.isOnline !== undefined) queryParams.$match.online = (requestParams.isOnline);

        if (requestParams.isWithPhoto !== undefined) queryParams.$match.avatarPath = (requestParams.isWithPhoto) ? {$exists: true} : {$exists: false};

        return this.next(requestParams, queryParams, new UserDataChain());
    }
}
