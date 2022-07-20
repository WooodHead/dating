import { Product, ProductDocument } from '../product.schema';
import { UsersDocuments } from '../../../users/schemas/users.schema';
import { Observable } from 'rxjs';
import { TransactionDocument } from '../../transaction/transaction.schema';

export interface IRule {

    name: string;

    buy(product: ProductDocument, buyer: UsersDocuments): Observable<TransactionDocument | boolean>;

    deactivate(product: Product, buyer: UsersDocuments): Observable<boolean>;
}
