import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { EmailExistInDBRule } from './validators/emailExistInDB.rule';
import { AdditionDataModule } from './modules/addition-data/addition-data.module';
import { HelpersModule } from './modules/helpers/helpers.module';
import { EmailNotExistInDBRule } from './validators/emailNotExistInDB.rule';
import { ContactModule } from './modules/contact/contact.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './modules/email/email.module';
import { isUserExistConstraint } from './validators/isUserExist.validator';
import { ChatModule } from './modules/chat/chat.module';
import { ReportModule } from './modules/report/report.module';
import { SearchModule } from './modules/search/search.module';
import { IsObjectIdConstraint } from './validators/isObjectId.validator';
import { IsContainsObjectIdConstraint } from './validators/isContainsObjectId.validator';
import { NotificationModule } from './modules/notification/notification.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { Credentials, S3 } from 'aws-sdk';
import { ScheduleModule } from '@nestjs/schedule';
import { PhotoModule } from './modules/photo/photo.module';
import { AlbumModule } from './modules/album/album.module';
import { LikeModule } from './modules/like/like.module';
import { DbModule } from './modules/database/db.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        DbModule,
        AwsSdkModule.forRoot({
            defaultServiceOptions: {
                region: process.env.AWS_REGION,
                credentials: new Credentials({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                })
            },
            services: [S3],
        }),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        UsersModule,
        AuthModule,
        FileModule,
        AdditionDataModule,
        HelpersModule,
        ContactModule,
        EmailModule,
        ChatModule,
        ReportModule,
        SearchModule,
        NotificationModule,
        PhotoModule,
        AlbumModule,
        LikeModule,
        PaymentModule
    ],
    controllers: [],
    providers: [
        EmailExistInDBRule,
        EmailNotExistInDBRule,
        isUserExistConstraint,
        IsObjectIdConstraint,
        IsContainsObjectIdConstraint
    ]
})
export class AppModule {
}
