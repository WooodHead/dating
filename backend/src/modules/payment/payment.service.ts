import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import { PurchaseService } from './purchase/purchase.service';
import { Types } from 'mongoose';
import { map, Observable, switchMap, throwError } from 'rxjs';
import * as moment from 'moment';
import { PurchaseCollection } from './purchase/purchase.type';
import { TransactionDocument } from './transaction/transaction.schema';
import { Product } from './product/product.schema';
import { UsersDocuments } from '../users/schemas/users.schema';
import { TransactionService } from './transaction/transaction.service';
import { ProductTypeEnum } from './product/product.enum';

@Injectable()
export class PaymentService {

    public constructor(
        public readonly productService: ProductService,
        public readonly purchaseService: PurchaseService,
        public readonly transactionService: TransactionService,
        public readonly paymentGatewayService: PaymentGatewayService,
    ) {}

    public buySubscription(product: Product, buyer: UsersDocuments): Observable<TransactionDocument> {
        return this.paymentGatewayService.createPayment().pipe(
            switchMap(response => this.transactionService.createTransaction())
        )
    }

    public deactivateSubscription(userId: Types.ObjectId): Observable<boolean> {
        return this.purchaseService.updatePurchase({
            user: userId,
            endAt: {$gt: moment().unix()},
            'product.type': ProductTypeEnum.subscription
        }, {autoPay: null})
    }

    public renewSubscription(userId: Types.ObjectId, autoPay: number): Observable<TransactionDocument> {
        return this.purchaseService.updatePurchase({
            user: userId,
            endAt: {$gt: moment().unix()},
            'product.type': ProductTypeEnum.subscription
        }, {autoPay}).pipe(
            switchMap(result => (result)
                ? this.paymentGatewayService.createPayment()
                : throwError(() => new UnprocessableEntityException('something went wrong'))
            )
        )
    }

    public getActiveSubscription(userId: Types.ObjectId): Observable<PurchaseCollection> {
        return this.purchaseService.getPurchaseByParams({
            user: userId,
            endAt: {$gt: moment().unix()}
        }).pipe(
            map(subscription => (subscription) ?? this.purchaseService.generateFreeSubscriptionDoc(userId)),
            map(subscription => ({subscription, rule: this.productService.findSubscriptionRuleByName(subscription.product.rule)}))
        )
    }
}
