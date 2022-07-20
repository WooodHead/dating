import {UsersDocuments} from "../../users/schemas/users.schema";
import { UserProfileDocuments } from '../../users/user-profile/schemas/userProfile.schema';

export class RegistrationCompletedEvent {

    public static readonly eventName = 'registration.completed';

    public constructor(
        public user: UsersDocuments,
        public profile: UserProfileDocuments
    ) {
    }
}
