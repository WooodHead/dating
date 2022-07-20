import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { UserProfileDocuments } from './schemas/userProfile.schema';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { UsersDocuments } from '../schemas/users.schema';
import { concatMap, mergeMap, switchMap, switchMapTo } from 'rxjs/operators';
import { MongooseHelpersService, UsersProfilePopulateEnums } from '../../helpers/mongoose-helpers.service';
import { combineLatest, map, mapTo, Observable, of, throwError } from 'rxjs';
import { UsersRelationsService } from '../users-relations/users-relations.service';
import { UserProfileService } from './user-profile.service';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from '../users.service';
import { ChatService } from '../../chat/chat.service';
import { TargetUseridDto } from '../../../dto/target-userid.dto';
import { TypeLikeDto } from '../../like/dto/type-like.dto';
import { LikeTargetObjectEnum } from '../../like/like.enum';
import { LikeService } from '../../like/like.service';
import { AuthUserProfile, OtherUserProfile } from './user-profile.type';
import { PaymentService } from '../../payment/payment.service';
import { LocationDocuments } from '../../addition-data/schemas/location.schema';

@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@ApiTags('User-profile')
@Controller('user-profile')
export class UserProfileController {

    public constructor(
        private readonly profileService: UserProfileService,
        private readonly relationsService: UsersRelationsService,
        private readonly userService: UsersService,
        private readonly chatService: ChatService,
        private readonly likeService: LikeService,
        private readonly paymentService: PaymentService
    ) {}

    @Get()
    getProfile(@User() user: UsersDocuments): Observable<AuthUserProfile> {
        return this.profileService.findProfileByParam({user: user._id}).pipe(
            concatMap((profile: UserProfileDocuments) => combineLatest({
                user: of({email: user.email, phone: user.phone}),
                profile: MongooseHelpersService.wrapPopulate<UserProfileDocuments>(profile, Object.values(UsersProfilePopulateEnums)),
                likes: this.likeService.profile.countLikes(user._id),
                subscription: this.paymentService.getActiveSubscription(user._id).pipe(map(collection => collection.subscription))
            }))
        );
    }

    @Get('user/:targetUserId')
    @ApiParam({name: 'targetUserId', type: String})
    getUserProfile(@User() authUser: UsersDocuments, @Param() {targetUserId}: TargetUseridDto, @Req() request: Request): Observable<OtherUserProfile> {

        if ((String(authUser._id) == String(targetUserId))) throw new HttpException('same user', HttpStatus.NOT_ACCEPTABLE);

        return this.profileService.findProfileByParam({user: authUser._id}).pipe(
            switchMap(authProfile => this.profileService.findProfileWithDistance(targetUserId, authProfile.place).pipe(
                map(dataset => this.profileService.populateUserBootProfile({distance: dataset.distance, locationId: authProfile.location}, dataset.profile))
            )),
            switchMap(data =>
                MongooseHelpersService.wrapPopulate<UserProfileDocuments>(data.profile, Object.values(UsersProfilePopulateEnums))
                    .pipe(map(profile => ({profile, distance: data.distance})))
            ),
            switchMap((data: {profile: UserProfileDocuments & {location: LocationDocuments}, distance: number}) => combineLatest({
                profile: of(data.profile),
                distance: of( Math.floor(data.distance)),
                likes: this.likeService.profile.countLikes(targetUserId).pipe(
                    switchMap(likes =>
                        this.likeService.profile.isUserPutLike(targetUserId, authUser._id).pipe(map(result => {
                                return {...likes, ...result}
                            })
                        )
                    )
                ),
                relations: this.relationsService.relationBothUsers(authUser._id, data.profile.user),
                chatLink: this.chatService.chatLink(authUser._id, data.profile.user)
            })),
        );
    }

    @ApiBody({type: UpdateProfileDto})
    @Patch()
    public update(@User() user: UsersDocuments, @Body() dto: UpdateProfileDto) {
        return this.profileService.updateUserProfile(user._id, dto).pipe(
            mergeMap(profile => MongooseHelpersService.wrapPopulate<UserProfileDocuments>(profile, Object.values(UsersProfilePopulateEnums)))
        );
    }

    @HttpCode(200)
    @Post('/like/:targetUserId')
    @ApiParam({name: 'targetUserId', type: String})
    @ApiBody({type: TypeLikeDto})
    public putLikeProfile(@User() user: UsersDocuments, @Param() {targetUserId}: TargetUseridDto, @Body() {likeType}: TypeLikeDto) {
        const _like = {ownerId: user._id, type: likeType, targetId: targetUserId, object: LikeTargetObjectEnum.profile}
        return combineLatest({
            targetUserProfile: this.profileService.findProfileByParam({user: targetUserId}),
            existLike: this.likeService.findLikeOrNullByParams(_like)
        }).pipe(
            switchMap(({existLike}) => (existLike)
                ? this.likeService.deleteLike(existLike._id).pipe(
                    switchMapTo(throwError(() => new HttpException('like has been deleted', HttpStatus.ACCEPTED)))
                )
                : this.likeService.profile.putLike(_like).pipe(mapTo({statusCode: HttpStatus.OK, message: 'like has been created'}))
            ),
        )
    }
}
