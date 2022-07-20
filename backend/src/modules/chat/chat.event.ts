import { ChatMessageDocuments } from './messages/schemas/chat-message.schema';
import { ChatRoomDocuments } from './chat-rooms/schemas/chat-room.schema';
import { UsersDocuments } from '../users/schemas/users.schema';
import { Types } from 'mongoose';


export class MessageSendEvent {

    public static eventName = 'message.send';

    public constructor(
        public message: ChatMessageDocuments
    ) {}
}

export class MessagesReadEvent {

    public static eventName = 'message.read';

    public constructor(
        public msg: ChatMessageDocuments[]
    ) {}
}

export class RoomCreateEvent {

    public static eventName = 'room.create';

    public constructor(
        public room: ChatRoomDocuments
    ) {}
}

export class ChatDeleteEvent {

    public static eventName = 'chat.delete';

    public constructor(
        public chatLink: string,
        public toUser: Types.ObjectId,
        public user: UsersDocuments
    ) {}
}
