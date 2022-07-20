import { ChainSearchParams, IChain } from './IChain';
import { MainSearchQuery } from '../search.type';

export abstract class BaseChain implements IChain {

    public abstract do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery

    public next(requestParams: ChainSearchParams, queryParams: MainSearchQuery, nextChain: IChain | null = null): MainSearchQuery {
        if(!nextChain) return queryParams;
        return nextChain.do(requestParams, queryParams);
    }

}
