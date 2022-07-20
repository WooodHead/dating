import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateNotificationConfigDto } from './dto/updateNotificationConfig.dto';
import { combineLatest, map, switchMap } from 'rxjs';
import { MessageNotificationService } from './message-notification.service';
import { AlbumNotificationService } from './album-notification.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notification')
@ApiTags('Notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class NotificationController {

    constructor(
        private readonly notificationService: NotificationService,
        private readonly messageNotificationService: MessageNotificationService,
        private readonly albumNotificationService: AlbumNotificationService,
    ) {}

    @Get()
    public getNotifications(@User() user: UsersDocuments) {
        return combineLatest({
            messages: this.messageNotificationService.getMessageNotificationByUser(user._id),
            sharedAlbums: this.albumNotificationService.getAllNotificationByUser(user._id)
        })
    }

    @Get('config')
    public getConfig(@User() user: UsersDocuments) {
        return this.notificationService.findOrCreateNotificationConfigDocument(user._id)
    }

    @Patch('config')
    @ApiBody({type: UpdateNotificationConfigDto})
    public updateConfig(@User() user: UsersDocuments, @Body() dto: UpdateNotificationConfigDto) {
        return this.notificationService.findOrCreateNotificationConfigDocument(user._id).pipe(
            switchMap(config => this.notificationService.updateNotificationConfigModel(config, dto))
        )
    }

    @Delete()
    @ApiBody({type: NotificationDto})
    public deleteNotifications(@User() user: UsersDocuments) {
        return this.notificationService.deleteNotificationsByUser(user._id).pipe(
          map(result => (result) ? {message: 'notifications deleted'} : {message: 'notifications not deleted'})
        )
    }

    @Delete(':notificationId')
    public deleteNotification(@Param() {notificationId}: NotificationDto, @User() user: UsersDocuments) {
        return this.notificationService.deleteNotificationsByParams({toUser: user._id, _id: notificationId}).pipe(
          map(result => (result) ? {message: 'notification deleted'} : {message: 'notification not deleted'})
        )
    }
}
