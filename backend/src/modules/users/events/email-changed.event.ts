import {UsersDocuments} from "../schemas/users.schema";

export class EmailChangedEvent {

    public static eventName = 'email.change';

    public constructor(
        public user: UsersDocuments
    ) {
    }
}

export class EmailChangedOldEmailEvent {

    public static eventName = 'old.email.change';

    public constructor(
        public user: UsersDocuments
    ) {
    }
}
