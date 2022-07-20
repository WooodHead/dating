import {UsersDocuments} from "../schemas/users.schema";
import { UserProfileDocuments } from '../user-profile/schemas/userProfile.schema';

export class PasswordResetByTokenEvent {

    public static readonly eventName = 'password.reset';

    public constructor(
        public user: UsersDocuments,
        public profile: UserProfileDocuments
    ) {}
}
