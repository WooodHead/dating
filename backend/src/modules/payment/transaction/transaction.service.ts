import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Transaction, TransactionDocument } from './transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionService {

    constructor(
        @InjectModel(Transaction.name) private readonly transactionDoc: Model<TransactionDocument>,
    ) {}

    public createTransaction(): Observable<TransactionDocument> {
        return of(undefined);
    }

}
