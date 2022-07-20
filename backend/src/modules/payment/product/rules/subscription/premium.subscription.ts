import { ProductDocument } from '../../product.schema';
import { UsersDocuments } from '../../../../users/schemas/users.schema';
import { Observable, switchMap, tap } from 'rxjs';
import { TransactionDocument } from '../../../transaction/transaction.schema';
import { PaymentService } from '../../../payment.service';
import { SubscriptionEnum } from '../../product.enum';
import { Subscription } from './base.subscription';

export class PremiumSubscription extends Subscription {
    public name = SubscriptionEnum.premium;

    public buy(product: ProductDocument, buyer: UsersDocuments): Observable<TransactionDocument> {
        let _service: PaymentService;
        return this.paymentService.pipe(
            tap(service => _service = service),
            switchMap(service => service.getActiveSubscription(buyer._id)),
            switchMap(collection => (collection.subscription.product.name == SubscriptionEnum.free)
                ? _service.buySubscription(product, buyer)
                : _service.renewSubscription(buyer._id, collection.subscription.endAt)
            )
        )
    }

    public photoLimit() {
        // TODO: reload method
    }
}
