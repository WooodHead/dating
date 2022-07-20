import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { AdditionDataModule } from '../addition-data/addition-data.module';
import { SearchService } from './search.service';
import { AlbumShareModule } from '../album/album-share/album-share.module';
import { LikeModule } from '../like/like.module';

@Module({
    controllers: [SearchController],
    imports: [
        AdditionDataModule,
        AlbumShareModule,
        LikeModule
    ],
    providers: [SearchService]
})
export class SearchModule {
}
