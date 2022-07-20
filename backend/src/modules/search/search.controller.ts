import { Controller, Get, Query, Req, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchParamDto } from './dto/search-param.dto';
import { Request } from 'express';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { UsersService } from '../users/users.service';
import { SearchLocationDto } from './dto/search-location.dto';
import { SearchService } from './search.service';
import { concatMap, from, last, map, Observable, of, scan, throwError } from 'rxjs';
import { AdditionDataService } from '../addition-data/addition-data.service';
import { AlbumShareService } from '../album/album-share/album-share.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { UsersRelationsService } from '../users/users-relations/users-relations.service';
import { SearchUserShareDto } from './dto/search-user-share.dto';
import { UsersSearchLimitGuard } from '../../guards/triggers/users-search-limit.guard';
import { catchError } from 'rxjs/operators';
import { PermissionResponse } from '../album/album.type';


@ApiTags('Search')
@Controller('search')
export class SearchController {

    public constructor(
        private readonly searchService: SearchService,
        private readonly additionalDataServices: AdditionDataService,
        private readonly userService: UsersService,
        private readonly profileService: UserProfileService,
        private readonly shareAlbumService: AlbumShareService,
        private readonly relationsService: UsersRelationsService,
    ) {}

    @Get()
    @UseGuards(UsersSearchLimitGuard)
    @ApiQuery({type: SearchParamDto})
    public search(@Query() params: SearchParamDto, @Req() request: Request) {
        return this.userService.extractUserOrNullFromRequest(request).pipe(
            concatMap(userOrNull => this.searchService.prepareDataToChain(params, request, userOrNull?._id).pipe(
                map(preparedData => this.searchService.filterMainSearchChain(preparedData)),
                concatMap(preparedData => this.profileService.search(preparedData, params.take, params.offset)),
                concatMap(items => (items.length > 0) ? this.searchService.makeSearchResponse(items, userOrNull?._id) : of([]))
            )),
        )
    }

    @Get('location')
    @ApiQuery({type: SearchLocationDto})
    public city(@Query() params: SearchLocationDto) {
        return this.additionalDataServices.searchCityName(params.cityName, params.take, params.offset)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @Get('share')
    @ApiQuery({type: SearchUserShareDto})
    public shareSearch(@User() user: UsersDocuments, @Query() {name, take, offset}: SearchUserShareDto): Observable<PermissionResponse[]> {
        return this.relationsService.listOfBlockUsers(user._id).pipe(
            map(ids => {
                ids.push(user._id);
                return ids;
            }),
            concatMap(ids => this.profileService.searchByName(name, ids, offset, take, {
                name: 1,
                user: 1,
                avatarPath: 1,
                smAvatarPath: 1
            })),
            concatMap(users => (users.length != 0) ? from(users) : throwError(() => new UnprocessableEntityException('arr is empty'))),
            concatMap(targetUser =>
                this.shareAlbumService.getSharePermissionsByParams({
                    userId: user._id,
                    targetUserId: targetUser.user
                },{albumId: 1}).pipe(map(permission => ({profile: targetUser, permissionToAlbums: permission})))
            ),
            scan((acc, curr) => {
                acc.push(curr);
                return acc;
            }, []),
            last(),
            catchError(() => of([]))
        )
    }
}
