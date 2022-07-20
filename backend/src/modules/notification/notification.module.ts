import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsConfigs, NotificationsConfigsSchema } from './schemas/notifications-configs.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationListeners } from './notification.listeners';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../auth/auth.module';
import { AlbumNotificationService } from './album-notification.service';
import { MessageNotificationService } from './message-notification.service';
import { EmailTaskService } from './email-task.service';
import { EmailModule } from '../email/email.module';


@Module({
    controllers: [NotificationController],
    providers: [NotificationService, EmailTaskService, AlbumNotificationService, MessageNotificationService, NotificationListeners, NotificationGateway],
    exports: [NotificationService, EmailTaskService, AlbumNotificationService],
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            {name: NotificationsConfigs.name, schema: NotificationsConfigsSchema},
            {name: Notification.name, schema: NotificationSchema},
        ]),
        EmailModule
    ]
})
export class NotificationModule {}
