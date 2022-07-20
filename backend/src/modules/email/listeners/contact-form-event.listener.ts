import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContactFormCreateEvent } from '../../contact/events/contact-form-create.event';
import { EmailService } from '../email.service';
import { EmailHelper } from '../../helpers/email.helper';

@Injectable()
export class ContactFormEventListener {

    public constructor(
        private readonly emailService: EmailService
    ) {}

    @OnEvent(ContactFormCreateEvent.eventName)
    handleContactFormEvents(event: ContactFormCreateEvent) {
        this.emailService.sendEmail({
            from: EmailHelper.getEmailDomain(event.contact.domain).supportEmail,
            to: [EmailHelper.getEmailDomain(event.contact.domain).supportEmail],
            text: `${event.contact.message} from: ${event.contact.email}`,
            subject: `Contact Form (${event.contact.domain})`
        }, event.contact.domain)
    }

}
