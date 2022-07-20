import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { TransactionDocument } from '../transaction/transaction.schema';

@Injectable()
export class PaymentGatewayService {

    public constructor() {}

    public createPayment(): Observable<TransactionDocument> {
        return of(undefined);
    }

    public cancelPayment(): Observable<any> {
        return of(true)
    }
}
