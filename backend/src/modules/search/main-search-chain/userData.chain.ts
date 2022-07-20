import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import SortChain from './sort.chain';
import { MainSearchQuery } from '../search.type';

export default class UserDataChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {

        (requestParams.user.length > 0)
            ? queryParams.$match.user = {$nin: requestParams.user}
            : delete queryParams.$match.user;

        return this.next(requestParams, queryParams, new SortChain());
    }
}
