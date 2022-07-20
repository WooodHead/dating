import {UsersDocuments} from "../schemas/users.schema";

export class OnlineStatusEvent {

    public static eventName = 'user.online';

    public constructor(
        public user: UsersDocuments,
        public isOnline: boolean,
        public socketId?: string
    ) {
    }
}
