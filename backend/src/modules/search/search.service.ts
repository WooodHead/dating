import { Injectable } from '@nestjs/common';
import { combineLatest, concatMap, from, last, map, Observable, of, scan, shareReplay } from 'rxjs';
import { AdditionDataService } from '../addition-data/addition-data.service';
import { SearchParamDto } from './dto/search-param.dto';
import { ChainSearchParams } from './main-search-chain/IChain';
import ProfileChain from './main-search-chain/profile.chain';
import { Types } from 'mongoose';
import { UsersRelationsService } from '../users/users-relations/users-relations.service';
import { Request } from 'express';
import { MainSearchQuery, SearchResponseType } from './search.type';
import { MongooseHelpersService, UsersProfilePopulateEnums } from '../helpers/mongoose-helpers.service';
import { LikeService } from '../like/like.service';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { UserProfileService } from '../users/user-profile/user-profile.service';

@Injectable()
export class SearchService {

    public constructor(
        private readonly additionalDataServices: AdditionDataService,
        private readonly relationService: UsersRelationsService,
        private readonly likeService: LikeService,
        private readonly profileService: UserProfileService
    ) {
    }

    public prepareDataToChain(dto: SearchParamDto, request: Request, userId: Types.ObjectId | null): Observable<ChainSearchParams> {
        return combineLatest({

            host: of(request.headers.host),

            location: (dto.location)
                ? this.additionalDataServices.getLocationByParam({_id: dto.location})
                : of(undefined),

            user: (userId)
                ? this.relationService.usersIdsWhoBlockActiveUser(userId).pipe(
                    map(blockedIds => {
                        blockedIds.push(userId);
                        return blockedIds;
                    })
                )
                : of([]),

            userProfile: (userId)
                ? this.profileService.findProfileByParam({user: userId})
                : of(undefined),

        }).pipe(
            map(data => {
                return {...dto, ...data}
            })
        )
    }

    public filterMainSearchChain(params: ChainSearchParams): MainSearchQuery {
        const chain = new ProfileChain();
        return chain.do(params, {$match: {}});
    }

    public makeSearchResponse(data: { profile: UserProfileDocuments, distance: number }[], authUserId = undefined): Observable<SearchResponseType[]> {

        const authUserProfile$: Observable<UserProfileDocuments> = this.profileService.findProfileByParam({user: authUserId}).pipe(shareReplay(1));

        return from(data).pipe(

            concatMap(dataset => (authUserId)
                ? authUserProfile$.pipe(
                    map(profile =>
                        this.profileService.populateUserBootProfile({
                            distance: dataset.distance,
                            locationId: profile.location
                        }, dataset.profile))
                )
                : of(dataset)
            ),

            concatMap(item => combineLatest({
                profile: of(item.profile).pipe(
                    concatMap(model => MongooseHelpersService.wrapPopulate(model, Object.values(UsersProfilePopulateEnums)))
                ),
                distance: of(item.distance),
                likes: this.likeService.likesByProfile(item.profile, authUserId),
            })),

            scan((acc, curr) => {
                acc.push(curr);
                return acc;
            }, []),
            last()
        )
    }
}
