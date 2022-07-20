import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { concatMap, switchMap, switchMapTo } from 'rxjs/operators';
import { combineLatest, map, mapTo, of, tap, throwError } from 'rxjs';
import { FileService } from '../file/file.service';
import { PhotoService } from './photo.service';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { AvatarSaveDto } from '../users/user-profile/dto/avatar-save.dto';
import { FileHelperService } from '../helpers/file-helper.service';
import { PhotoDeletedEvent } from './events/photo-deleted.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import FileSystemAdapter from '../file/adapter/FileSystem.adapter';
import { TargetUseridDto } from '../../dto/target-userid.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { PhotoDocuments } from './schemas/photo.schema';
import { AlbumIdDto } from '../album/dto/album-id.dto';
import { OffsetTakeDto } from '../../dto/offset-take.dto';
import { AlbumService } from '../album/album.service';
import { AccessToAlbumPhotoGuard } from '../../guards/access-to-album-photo.guard';
import { AccessToPhotoGuard } from '../../guards/access-to-photo.guard';
import { PhotoIdDto } from './dto/photoId.dto';
import { TypeLikeDto } from '../like/dto/type-like.dto';
import { LikeTargetObjectEnum } from '../like/like.enum';
import { LikeService } from '../like/like.service';
import { AlbumAccessGuard } from '../../guards/triggers/album-access.guard';
import { PhotoCountGuard } from '../../guards/triggers/photo-count.guard';
import { PaymentService } from '../payment/payment.service';

@ApiTags('Photos')
@Controller('photo')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class PhotoController {

    public constructor(
        private readonly fileService: FileService,
        private readonly profileService: UserProfileService,
        private readonly photoService: PhotoService,
        private readonly albumService: AlbumService,
        private readonly eventEmitter: EventEmitter2,
        private readonly likeService: LikeService,
        private readonly paymentService: PaymentService
    ) {}

    @UseInterceptors(FileInterceptor('avatar'))
    @Put('avatar')
    @ApiBody({type: AvatarSaveDto})
    public saveAvatar(@User() user: UsersDocuments, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException('empty img field', HttpStatus.BAD_REQUEST);
        return this.fileService.uploadImg(file.buffer, FileSystemAdapter.targetDir, 'avatars', FileHelperService.createFileName('jpg')).pipe(
            switchMap(path => this.photoService.deleteUsersAvatar(user._id).pipe(mapTo(path))),
            map(path => {
                return {
                    avatarPath: this.fileService.getImgUrl(path, FileHelperService.mediumImgPrefix),
                    smAvatarPath: this.fileService.getImgUrl(path, FileHelperService.smallImgPrefix),
                    originalAvatarPath: path,
                }
            }),
            switchMap(paths =>
                this.profileService.updateUserProfile(user._id, paths).pipe(mapTo({
                    message: 'avatar has been updated',
                    path: paths.avatarPath,
                    smPath: paths.smAvatarPath,
                    original: paths.originalAvatarPath
                }))
            ),
        );
    }

    @UseGuards(PhotoCountGuard)
    @UseInterceptors(FileInterceptor('photo'))
    @Post()
    @ApiBody({type: AvatarSaveDto})
    public saveMainPhoto(@User() user: UsersDocuments, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException('empty img field', HttpStatus.BAD_REQUEST);
        return of(file.buffer).pipe(
            switchMap(buffer => this.photoService.uploadPhotoToS3(user._id, buffer)),
            map((photo: PhotoDocuments) => {
                return {
                    message: 'photo has been saved',
                    path: this.fileService.getImgUrl(photo.photoPath, FileHelperService.largeImgPrefix),
                    photoId: photo._id
                }
            })
        )
    }

    @UseGuards(PhotoCountGuard)
    @UseInterceptors(FileInterceptor('photo'))
    @Post(':albumId')
    @ApiParam({name: 'albumId', type: String})
    public savePhotoToAlbum(@User() user: UsersDocuments, @Param() {albumId}: UploadPhotoDto, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException('empty img field', HttpStatus.BAD_REQUEST);
        return of(file.buffer).pipe(
            switchMap(buffer => this.albumService.findAlbumByParams({
                    _id: albumId,
                    belongTo: user._id
                }, {_id: 1}).pipe(map(album => {
                    return {buffer, album};
                }))
            ),
            switchMap(data => this.photoService.uploadPhotoToS3(user._id, data.buffer, data.album._id)),
            map((photo: PhotoDocuments) => {
                return {
                    message: 'photo has been saved',
                    path: this.fileService.getImgUrl(photo.photoPath, FileHelperService.largeImgPrefix),
                    photoId: photo._id
                }
            })
        )
    }

    @UseGuards(AccessToAlbumPhotoGuard, AlbumAccessGuard)
    @Get('album/:album_id')
    @ApiParam({name: 'album_id', type: String})
    @ApiQuery({type: PhotoIdDto})
    public getPhotosByAlbum(@User() user: UsersDocuments, @Param() param: AlbumIdDto, @Query() dto: OffsetTakeDto) {
        return this.albumService.findAlbumByParams({_id: param.album_id}).pipe(
            map(album => (album.photos.length) ? album.photos.slice(dto.offset, dto.take) : []),
            concatMap(photoIds => this.photoService.getPhotosWithLikes({_id: {$in: photoIds}})),
            map(photos => photos.map(photo => {
                const link = this.fileService.getImgUrl(photo.photoPath, FileHelperService.mediumImgPrefix);
                const likes = this.likeService.photo.countLikes(photo, user._id)
                return {link, photoId: photo._id, likes};
            })),
            map(arr => {
                return {photos: arr}
            })
        );
    }

    @Get('main/:targetUserId')
    @ApiParam({name: 'targetUserId', type: String})
    @ApiQuery({type: PhotoIdDto})
    public getMainPhotos(@User() user: UsersDocuments, @Param() param: TargetUseridDto) {
        return combineLatest({
            docs: this.photoService.getPhotosWithLikes({
                belongTo: param.targetUserId,
                album: {$exists: false}
            }),
            subscribeCollection: this.paymentService.getActiveSubscription(user._id)
        }).pipe(
            map(data=> data.docs.map((photo, index) => {
                const link = data.subscribeCollection.rule.makeLinkToMdPhoto(photo, index)
                const likes = this.likeService.photo.countLikes(photo, user._id)
                return {link: link.url, type: (link.type == FileHelperService.mediumBlurImgPrefix) ? 'blur': 'noblur', photoId: photo._id, likes};
            })),
            map(arr => {
                return {photos: arr}
            })
        )
    }

    @UseGuards(AccessToPhotoGuard)
    @Get(':photoId')
    @ApiQuery({type: PhotoIdDto})
    public getPhoto(@User() user: UsersDocuments, @Param() params: PhotoIdDto) {
        return this.photoService.getPhoto({_id: params.photoId}).pipe(
            map(path => this.fileService.getImgUrl(path.photoPath, FileHelperService.largeImgPrefix)),
            map(link => {
                return {link}
            })
        )
    }

    @Delete(':photoId')
    @ApiQuery({type: PhotoIdDto})
    public photoDelete(@User() user: UsersDocuments, @Param() params: PhotoIdDto) {
        return this.photoService.getPhoto({_id: params.photoId, belongTo: user.id}).pipe(
            switchMap(photo => this.photoService.deletePhoto(photo).pipe(mapTo(photo))),
            tap(photo => this.eventEmitter.emit(PhotoDeletedEvent.eventName, new PhotoDeletedEvent(photo))),
            mapTo({message: 'photo has been deleted'})
        )
    }

    @HttpCode(200)
    @Post('like/:photoId')
    @ApiBody({type: TypeLikeDto})
    @ApiParam({name: 'photoId', type: String})
    public putLikePhoto(@User() user: UsersDocuments, @Param() {photoId}: PhotoIdDto, @Body() {likeType}: TypeLikeDto) {
        return this.photoService.getPhoto({_id: photoId}).pipe(
            map(photo => {
                return {
                    photo,
                    like: {
                        ownerId: user._id,
                        type: likeType,
                        targetId: photo.belongTo,
                        object: LikeTargetObjectEnum.photo,
                        photoId: photo._id
                    }
                }
            }),
            switchMap(({
                           photo,
                           like
                       }) => this.likeService.findLikeOrNullByParams(like).pipe(map(likeModel => {
                return {
                    likeModel,
                    like
                }
            }))),
            switchMap(({likeModel, like}) => (likeModel)
                ? this.likeService.deleteLike(likeModel._id).pipe(
                    switchMapTo(throwError(() => new HttpException('like has been deleted', HttpStatus.ACCEPTED)))
                )
                : this.likeService.photo.putLike(like).pipe(mapTo({
                    statusCode: HttpStatus.OK,
                    message: 'like has been created'
                }))
            ),
        )
    }
}
