import { BaseChain } from './base.chain';
import LocationChain from './location.chain';
import { ChainSearchParams } from './IChain';
import { MainSearchQuery } from '../search.type';

export default class WeightChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {

        if (!requestParams.weight) return this.next(requestParams, queryParams, new LocationChain());

        queryParams.$match = {
            ...queryParams.$match, weight: {
                $gte: requestParams.weight
            }
        }

        return this.next(requestParams, queryParams, new LocationChain());
    }
}
