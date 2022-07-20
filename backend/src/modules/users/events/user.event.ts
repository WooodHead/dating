import { UsersDocuments } from '../schemas/users.schema';
import { UserProfileDocuments } from '../user-profile/schemas/userProfile.schema';

export class UserRegistrationComplete {

    public static eventName = 'user.registration.complete';

    public constructor(
        public user: UsersDocuments,
        public profile: UserProfileDocuments
    ) {}
}
