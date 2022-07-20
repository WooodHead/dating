import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSharePermission, AlbumSharePermissionSchema } from './album-share-permission.schema';
import { AlbumShareService } from './album-share.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: AlbumSharePermission.name, schema: AlbumSharePermissionSchema},
        ]),
    ],
    controllers: [],
    providers: [AlbumShareService],
    exports: [AlbumShareService]
})
export class AlbumShareModule {}
