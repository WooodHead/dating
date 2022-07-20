import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import { MainSearchQuery } from '../search.type';


export default class SortChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {

        queryParams.$addFields = {
            $addFields: {
                sortNum: {
                    $cond: [
                        { $eq: ['$_user.host', requestParams.host] },
                        0,
                        1
                    ]
                }
            },
        }

        queryParams.$sort = {
            $sort: {
                sortNum: 1,
                name: 1
            }
        }

        return this.next(requestParams, queryParams);
    }
}
