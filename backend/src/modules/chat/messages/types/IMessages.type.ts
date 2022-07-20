import {ChatMessageDocuments} from "../schemas/chat-message.schema";

export interface IMessagesType {
    messages: ChatMessageDocuments[],
    UnreadMessages: ChatMessageDocuments[],
    UnreadMessagesCount: number
}
