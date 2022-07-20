import { RegistrationDocument } from '../../auth/registration.schema';

export class SendVerificationEmail {

    public static readonly eventName = 'email.verification';

    public constructor(
        public rowData: RegistrationDocument
    ) {}
}
