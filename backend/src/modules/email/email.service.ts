import { Injectable, OnModuleInit } from '@nestjs/common';
import { IEmail } from './interfaces/IEmail';
import { Observable } from 'rxjs';
import { IEmailAdapter } from './adapter/IEmailAdapter';
import MailgunAdapter from './adapter/Mailgun.adapter';
import MailHogAdapter from './adapter/MailHog.adapter';


@Injectable()
export class EmailService implements OnModuleInit {

    private email: IEmailAdapter;

    onModuleInit() {
        this.email = (process.env.MAIL_SERVICE == 'mailgun') ? new MailgunAdapter() : new MailHogAdapter()
    }

    public sendEmail(email: IEmail, domainName: string): Observable<any> {
        return this.email.send(email, domainName);
    }
}
