import { BaseChain } from './base.chain';
import { ChainSearchParams } from './IChain';
import AdditionalChain from './additional.chain';
import { MainSearchQuery } from '../search.type';

export default class LocationChain extends BaseChain {

    public do(requestParams: ChainSearchParams, queryParams: MainSearchQuery): MainSearchQuery {

        if (!requestParams.location && !requestParams.userProfile?.place) return this.next(requestParams, queryParams, new AdditionalChain());

        const centerPoint = (requestParams.location) ? requestParams.location.location : requestParams.userProfile.place;

        const maxDistance = (requestParams.location) ? requestParams.distance : undefined;

        delete queryParams.$match.location;

        queryParams.$geoNear = {
            $geoNear: {
                near: centerPoint,
                distanceField: 'distance',
                spherical: true,
                distanceMultiplier: 0.001
            }
        }

        if(maxDistance) queryParams.$geoNear.$geoNear.maxDistance = maxDistance * 1000;

        return this.next(requestParams, queryParams, new AdditionalChain());

    }

}
