import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import WeightChain from './weight.chain';
import { MainSearchQuery } from '../search.type';

export default class HeightChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {

        if (!requestParams.height) return this.next(requestParams, queryParams, new WeightChain());

        queryParams.$match = {
            ...queryParams.$match, height: {
                $gte: requestParams.height
            }
        }

        return this.next(requestParams, queryParams, new WeightChain());
    }
}
