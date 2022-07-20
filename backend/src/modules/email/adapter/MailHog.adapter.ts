import { IEmailAdapter } from './IEmailAdapter';
import { from, Observable } from 'rxjs';
import * as nodemailer from 'nodemailer';
import { IEmail } from '../interfaces/IEmail';

export default class MailHogAdapter implements IEmailAdapter {

    private readonly nodemail = nodemailer.createTransport({
        port: Number(process.env.MAILHOG_PORT),
        host: process.env.MAILHOG_HOST
    });

    public send(email: IEmail, domainName: string): Observable<any> {
        return from(this.nodemail.sendMail(email));
    }

}
