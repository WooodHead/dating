import { Observable } from 'rxjs';
import { IEmail } from '../interfaces/IEmail';

export interface IEmailAdapter {

    send(email: IEmail, domainName: string): Observable<any>;

}
