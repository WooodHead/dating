import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { ForbiddenWords, ForbiddenWordsSchema } from './schemas/forbidden-words.schema';
import { MessagesService } from './messages.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: ChatMessage.name, schema: ChatMessageSchema}]),
        MongooseModule.forFeature([{name: ForbiddenWords.name, schema: ForbiddenWordsSchema}]),
    ],
    controllers: [],
    providers: [MessagesService],
    exports: [MessagesService]
})
export class MessagesModule {}
