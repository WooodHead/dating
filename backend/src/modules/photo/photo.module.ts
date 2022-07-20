import { forwardRef, Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { FileService } from '../file/file.service';
import { AlbumModule } from '../album/album.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './schemas/photo.schema';
import { AlbumShareModule } from '../album/album-share/album-share.module';
import { LikeModule } from '../like/like.module';

@Module({
    providers: [PhotoService, FileService],
    controllers: [PhotoController],
    imports: [
        forwardRef(() => AlbumModule),
        AlbumShareModule,
        MongooseModule.forFeature([
            {name: Photo.name, schema: PhotoSchema}
        ]),
        LikeModule
    ],
    exports: [
        PhotoService
    ]
})
export class PhotoModule {}
