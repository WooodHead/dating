import { IEmailAdapter } from './IEmailAdapter';
import { from, Observable } from 'rxjs';
import { IEmail } from '../interfaces/IEmail';
import * as formData from 'form-data';
import Client from 'mailgun.js/lib/client';
import { EmailHelper } from '../../helpers/email.helper';


export default class MailgunAdapter implements IEmailAdapter {

    private mg: Client;

    constructor() {
        const Mailgun = require('mailgun.js');
        const mailgun = new Mailgun(formData);
        this.mg = mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API,
            url: 'https://api.eu.mailgun.net',
        });
    }

    public send(email: IEmail, domainName: string): Observable<any> {
        return from(this.mg.messages.create(
            EmailHelper.getEmailDomain(domainName).emailName,
            email
        ))
    }

}
