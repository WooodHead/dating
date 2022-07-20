import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/album.schema';
import { AlbumListener } from './listeners/album.listener';
import { PhotoModule } from '../photo/photo.module';
import { FileModule } from '../file/file.module';
import { AlbumShareModule } from './album-share/album-share.module';
import { AlbumShareController } from './album-share.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        forwardRef(() => PhotoModule),
        FileModule,
        AlbumShareModule,
        MongooseModule.forFeature([
            {name: Album.name, schema: AlbumSchema}
        ]),
        NotificationModule
    ],
    controllers: [AlbumController, AlbumShareController],
    providers: [AlbumService, AlbumListener],
    exports: [AlbumService]
})
export class AlbumModule {}
