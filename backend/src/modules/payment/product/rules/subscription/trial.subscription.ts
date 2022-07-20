import { ProductTypeEnum, SubscriptionEnum } from '../../product.enum';
import { ProductDocument } from '../../product.schema';
import { UsersDocuments } from '../../../../users/schemas/users.schema';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { TransactionDocument } from '../../../transaction/transaction.schema';
import { UnprocessableEntityException } from '@nestjs/common';
import { PaymentService } from '../../../payment.service';
import { PremiumSubscription } from './premium.subscription';


export class TrialSubscription extends PremiumSubscription {

    public name = SubscriptionEnum.trial;

    public buy(product: ProductDocument, buyer: UsersDocuments): Observable<TransactionDocument> {
        let _service: PaymentService;
        return this.paymentService.pipe(
            tap(service => _service = service),
            switchMap(service => service.purchaseService.countPurchases({
                user: buyer._id,
                'product.type': ProductTypeEnum.subscription
            })),
            switchMap(count => (count > 0)
                ? throwError(() => new UnprocessableEntityException('Subscription already bought'))
                : _service.buySubscription(product, buyer)
            )
        )
    }
}
