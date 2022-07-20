import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfile, UserProfileSchema } from './schemas/userProfile.schema';
import { FileService } from '../../file/file.service';
import { ChatModule } from '../../chat/chat.module';
import { LikeModule } from '../../like/like.module';
import { AdditionDataModule } from '../../addition-data/addition-data.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: UserProfile.name, schema: UserProfileSchema}]),
        ChatModule,
        LikeModule,
        AdditionDataModule
    ],
    providers: [UserProfileService, FileService],
    controllers: [UserProfileController],
    exports: [UserProfileService]
})
export class UserProfileModule {
}
