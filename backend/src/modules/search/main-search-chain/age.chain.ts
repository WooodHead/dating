import * as moment from 'moment';
import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import HeightChain from './height.chain';
import { MainSearchQuery } from '../search.type';

export default class AgeChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {
        if (!requestParams.minAge && !requestParams.maxAge) return this.next(requestParams, queryParams, new HeightChain());

        queryParams.$match = {
            ...queryParams.$match, dob: {
                $gte: moment().subtract(requestParams.maxAge, 'years').toDate(),
                $lt: moment().subtract(requestParams.minAge, 'years').toDate()
            }
        }
        return this.next(requestParams, queryParams, new HeightChain());
    }
}
