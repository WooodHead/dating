import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schema';
import { ChatRoomsController } from './chat-rooms.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{name: ChatRoom.name, schema: ChatRoomSchema}])
    ],
    providers: [ChatRoomsService],
    exports: [ChatRoomsService],
    controllers: [ChatRoomsController]
})
export class ChatRoomsModule {}
