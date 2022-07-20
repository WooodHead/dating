import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AlbumShareService } from './album-share/album-share.service';
import { AlbumService } from './album.service';
import { AlbumShareDto } from './dto/album-share.dto';
import { UsersDocuments } from '../users/schemas/users.schema';
import { User } from '../users/decorators/user.decorator';
import { AlbumTypeEnum } from './enums/album.enum';
import {
    combineLatest,
    concatMap,
    from,
    last,
    map,
    mapTo,
    mergeMap,
    Observable,
    of,
    switchMap,
    tap,
    throwError
} from 'rxjs';
import { AlbumDocuments } from './schemas/album.schema';
import { AlbumIdDto } from './dto/album-id.dto';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { AlbumShareDeleteDto } from './dto/album-share-delete.dto';
import { catchError } from 'rxjs/operators';
import { PermissionResponse } from './album.type';
import { NotificationService } from '../notification/notification.service';
import { NotificationEventTypesEnum } from '../notification/notification.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlbumNotificationService } from '../notification/album-notification.service';
import { AlbumRequestEvent } from './album.event';
import { TargetUseridDto } from '../../dto/target-userid.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller('album-share')
@ApiTags('Album-Share')
export class AlbumShareController {

    constructor(
        private readonly albumShareService: AlbumShareService,
        private readonly albumService: AlbumService,
        private readonly profileService: UserProfileService,
        private readonly notificationService: NotificationService,
        private readonly albumNotifications: AlbumNotificationService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Get()
    public listOfUserShare(@User() user: UsersDocuments) {
        return this.albumShareService.userShare(user._id);
    }

    @Get('to-user')
    public listOfShareToUser(@User() user: UsersDocuments) {
        return this.albumShareService.toUserShare(user._id);
    }

    @Get(':album_id')
    @ApiParam({name: 'album_id', type: String})
    public listSharingByAlbum(@User() user: UsersDocuments, @Param() {album_id}: AlbumIdDto): Observable<PermissionResponse[]> {
        return this.albumShareService.getSharePermissionsByParams({
            userId: user._id,
            albumId: album_id
        }, {targetUserId: 1}).pipe(
            map(permissions => permissions.map(permission => permission.targetUserId)),
            switchMap(listOfIds => this.profileService.findProfilesByParam({user: {$in: listOfIds}})),
            map(users => users.map(user => ({profile: user})))
        )
    }

    @Post()
    @ApiBody({type: AlbumShareDto})
    public shareAlbum(@User() user: UsersDocuments, @Body() {targetUserId, album_ids}: AlbumShareDto) {
        return from(album_ids).pipe(
            concatMap(album_id => combineLatest({
                album: this.albumService.findAlbumByParams({belongTo: user._id, _id: album_id}).pipe(
                    switchMap(album => (album.type == AlbumTypeEnum.private) ? of(album) : throwError(() => new HttpException('Albums type is not private', HttpStatus.CONFLICT))),
                ),
                permissionRecord: this.albumShareService.countAccessRow(album_id, targetUserId).pipe(
                    switchMap(result => (result > 0) ? throwError(() => new HttpException('Already exist', HttpStatus.CONFLICT)) : of(null))
                )
            })),

            concatMap(({
                           album,
                           permissionRecord
                       }) => this.albumShareService.createSharePermissionToAlbum(user._id, targetUserId, album as AlbumDocuments)),

            catchError(() => of(null)),
            last(),
            mapTo({message: 'share has been created'})
        );
    }

    @Delete()
    @ApiQuery({type: AlbumShareDeleteDto})
    public deleteShare(@User() user: UsersDocuments, @Query() {targetUserId, album_id}: AlbumShareDeleteDto) {
        return this.albumShareService.countAccessRow(album_id, targetUserId).pipe(
            switchMap(result => (result == 0) ? throwError(() => new HttpException('Share not exist', HttpStatus.CONFLICT)) : of(null)),
            switchMap(() => this.albumShareService.deleteSharePermission(user._id, targetUserId, album_id)),
            map(result => (result) ? {message: 'share has been deleted'} : {message: 'share not delete'})
        )
    }

    @Delete('refuse')
    @ApiQuery({type: TargetUseridDto})
    public refuseShare(@User() user: UsersDocuments, @Query() {targetUserId}: TargetUseridDto) {
        return this.albumShareService.deleteSharePermissions({userId: targetUserId, targetUserId: user._id}).pipe(
            switchMap(permissionCount => (permissionCount)
                ? of({message: 'shares has been deleted'})
                : throwError(() => new HttpException('share not delete', HttpStatus.CONFLICT))
            )
        )
    }

    @Get('request/:album_id')
    @ApiParam({name: 'album_id', type: String})
    public requestToShareAlbum(@User() user: UsersDocuments, @Param() {album_id}: AlbumIdDto) {
        return this.albumService.findAlbumByParams({_id: album_id}).pipe(
            mergeMap(album => (String(album.belongTo) == String(user._id))
                ? throwError(() => new HttpException('album belong to user', HttpStatus.CONFLICT))
                : of(album)
            ),
            mergeMap(album => (album.type != AlbumTypeEnum.private)
                ? throwError(() => new HttpException('album type is not private', HttpStatus.CONFLICT))
                : of(album)
            ),

            mergeMap(album => combineLatest({

                permission: this.albumShareService.isHaveAccess(user._id, album).pipe(
                    mergeMap(result => (result)
                        ? throwError(() => new HttpException('notification already created', HttpStatus.CONFLICT))
                        : of(null))
                ),

                notification: this.notificationService.findNotificationsByParams({
                    fromUser: user._id,
                    toUser: album.belongTo,
                    eventType: NotificationEventTypesEnum.requestToShare,
                    'additionalData.albumId': album_id
                }).pipe(
                    mergeMap(notifs => (notifs.length == 0)
                        ? of(null)
                        : throwError(() => new HttpException('notification already created', HttpStatus.CONFLICT))
                    )
                ),

            }).pipe(
                tap(() => this.eventEmitter.emit(AlbumRequestEvent.eventName, new AlbumRequestEvent(album, user._id))),
                map(() => ({message: 'request hav been sent'}))
            )),
        )
    }
}
