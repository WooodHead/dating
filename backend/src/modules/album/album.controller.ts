import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { AlbumCreateDto } from './dto/album-create.dto';
import { AlbumService } from './album.service';
import { combineLatest, map, mapTo, switchMap } from 'rxjs';
import { AlbumGetParamsDto } from './dto/album-get.dto';
import { Album } from './schemas/album.schema';
import { AlbumGetInfoDto } from './dto/album-get-info.dto';
import { AlbumUpdateDto } from './dto/album-update.dto';
import { AlbumIdDto } from './dto/album-id.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileHelperService } from '../helpers/file-helper.service';
import { FileService } from '../file/file.service';
import { AlbumShareService } from './album-share/album-share.service';
import { AlbumTypeEnum } from './enums/album.enum';
import { OffsetTakeDto } from '../../dto/offset-take.dto';
import { AlbumAccessGuard } from '../../guards/triggers/album-access.guard';
import { AlbumAccessByUserGuard } from '../../guards/triggers/album-access-by-user.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller('album')
@ApiTags('Album')
export class AlbumController {

    constructor(
        private readonly albumService: AlbumService,
        private readonly eventEmitter: EventEmitter2,
        private readonly fileService: FileService,
        private readonly shareService: AlbumShareService,
    ) {}

    @Post()
    public create(@User() user: UsersDocuments, @Body() dto: AlbumCreateDto) {
        return this.albumService.createNewAlbum({...dto, ownerId: user._id});
    }

    @ApiBody({type: AlbumUpdateDto})
    @ApiParam({name: 'album_id', type: String})
    @Patch(':album_id')
    public update(@Param() param: AlbumIdDto, @User() user: UsersDocuments, @Body() dto: AlbumUpdateDto) {
        return this.albumService.findAlbumByParams({
            _id: param.album_id,
            belongTo: user._id
        }, {
            belongTo: 0,
            havAccess: 0,
            __v: 0
        }).pipe(
            map(album => {
                album.name = dto.name;
                album.type = dto.type;
                return album;
            }),
            switchMap(album => album.save()),
            map(album => {
                album.titlePhoto = this.fileService.getImgUrl(album.titlePhoto, FileHelperService.titleImgPrefix);
                return album;
            })
        )
    }

    @UseGuards(AlbumAccessGuard)
    @Get('info/:album_id')
    @ApiParam({name: 'album_id', type: String})
    public getAlbum(@Param() param: AlbumGetInfoDto, @User() user: UsersDocuments) {
        return combineLatest({
            album: this.albumService.findAlbumByParams({_id: param.album_id}),
            permission: this.shareService.countAccessRow(param.album_id, user._id)
        }).pipe(
            map(data => {
                const titlePhotoBool = ((data.permission > 0) || (data.album.type != AlbumTypeEnum.private) || (String(user._id) == String(data.album.belongTo)));
                const prefix = (titlePhotoBool) ? FileHelperService.titleImgPrefix : FileHelperService.titleBlurImgPrefix;
                data.album.titlePhoto = this.fileService.getImgUrl(data.album.titlePhoto, prefix);
                return data.album;
            }))
    }

    @UseGuards(AlbumAccessByUserGuard)
    @Get('/public/:user_id')
    @ApiParam({name: 'user_id', type: String})
    @ApiQuery({type: OffsetTakeDto})
    public getPublicAlbums(@Param() param: AlbumGetParamsDto, @Query() dto: OffsetTakeDto, @User() user: UsersDocuments) {
        const _params = {belongTo: param.user_id, type: AlbumTypeEnum.public};
        return combineLatest({
            albums: this.albumService.findAlbumsByParams(
                _params,
                dto.offset,
                dto.take,
                {
                    belongTo: 0,
                    havAccess: 0,
                    __v: 0
                }
            ),
            count: this.albumService.countAlbums(_params)
        }).pipe(
            map(data => {
                    return {
                        album: data.albums.map(
                            album => {
                                if (!album.titlePhoto) return album;
                                album.titlePhoto = this.fileService.getImgUrl(album.titlePhoto, FileHelperService.titleImgPrefix);
                                return album;
                            }
                        ),
                        count: data.count
                    }
                }
            )
        )
    }

    @UseGuards(AlbumAccessByUserGuard)
    @Get('/private/:user_id')
    @ApiParam({name: 'user_id', type: String})
    @ApiQuery({type: OffsetTakeDto})
    public getPrivateAlbums(@Param() param: AlbumGetParamsDto, @Query() {
        take,
        offset
    }: OffsetTakeDto, @User() user: UsersDocuments) {
        return combineLatest({
            albums: this.albumService.findPrivateAlbums(param.user_id, user._id, take, offset),
            count: this.albumService.countAlbums({
                belongTo: param.user_id,
                type: AlbumTypeEnum.private
            })
        }).pipe(
            map(data => {
                    return {
                        album: data.albums.map(
                            album => {
                                if (!album.titlePhoto) return album;
                                album.titlePhoto = this.fileService.getImgUrl(album.titlePhoto, (album.sharePermission || String(album.belongTo) == String(user._id))
                                    ? FileHelperService.titleImgPrefix
                                    : FileHelperService.titleBlurImgPrefix
                                );
                                return album;
                            }
                        ),
                        count: data.count
                    }
                }
            )
        )
    }

    @Delete(':album_id')
    @ApiParam({name: 'album_id', type: String})
    public deleteAlbum(@User() user: UsersDocuments, @Param() param: AlbumIdDto) {
        return this.albumService.findAlbumByParams({
            belongTo: user._id,
            _id: param.album_id
        }).pipe(
            switchMap(album => this.albumService.deleteAlbum(album)),
            mapTo({message: 'album has been deleted'})
        )
    }
}
