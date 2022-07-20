import { Module } from '@nestjs/common';
import { ContactFormEventListener } from './listeners/contact-form-event.listener';
import { PasswordEventListener } from './listeners/password-event.listener';
import { EmailService } from './email.service';
import { UserEmailListener } from './listeners/user-email.listener';

@Module({
    imports: [],
    providers: [ContactFormEventListener, PasswordEventListener, UserEmailListener, EmailService],
    controllers: [],
    exports: [EmailService]
})
export class EmailModule {}
