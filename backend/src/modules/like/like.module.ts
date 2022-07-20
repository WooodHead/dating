import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './like.schema';

@Module({
    providers: [LikeService],
    imports: [
        MongooseModule.forFeature([
            {name: Like.name, schema: LikeSchema}
        ]),
    ],
    exports: [LikeService],
    controllers: []
})
export class LikeModule {}
