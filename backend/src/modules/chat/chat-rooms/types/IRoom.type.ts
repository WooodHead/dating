import { Types } from "mongoose";
import {RoomConfig} from "../schemas/chat-room.schema";

export interface IRoomType {
    _id: string | Types.ObjectId,
    config: RoomConfig,
    chatLink: string,
    profile: {
        online: boolean,
        avatarPath: string,
        name: string
    },
    lastMessage: {
        _id: string | Types.ObjectId,
        isRead: boolean,
        toUser: string | Types.ObjectId,
        message: string,
        createdAt: string,
        updatedAt: string,
    },
    unreadMessageCount?: number
}
