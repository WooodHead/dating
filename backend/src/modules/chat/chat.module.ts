import { Global, Module } from '@nestjs/common';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { MessagesModule } from './messages/messages.module';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
    imports: [
        MessagesModule,
        ChatRoomsModule,
        AuthModule,
    ],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
    exports: [MessagesModule, ChatRoomsModule, ChatModule, ChatService]
})
export class ChatModule {}
