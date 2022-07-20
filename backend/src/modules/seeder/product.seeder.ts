import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { concatMap, from, lastValueFrom } from 'rxjs';
import { ProductTypeEnum, SubscriptionEnum } from '../payment/product/product.enum';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ProductSeeder implements Seeder {

    constructor(
        private readonly paymentService: PaymentService
    ) {}

    private subscribes = [
        {
            name: SubscriptionEnum.free,
            dueDate: 0,
            price: 0,
            rule: SubscriptionEnum.free,
            type: ProductTypeEnum.subscription
        },
        {
            name: SubscriptionEnum.premium,
            dueDate: 3600 * 24 * 30,
            price: 12,
            rule: SubscriptionEnum.premium,
            type: ProductTypeEnum.subscription
        },
        {
            name: SubscriptionEnum.trial,
            dueDate: 3600 * 24 * 4,
            price: 4,
            rule: SubscriptionEnum.trial,
            type: ProductTypeEnum.subscription
        }

    ]

    async seed(): Promise<any> {
        return lastValueFrom(from(this.subscribes).pipe(
            concatMap(subscribe => this.paymentService.productService.createProduct(subscribe))
        ));
    }

    async drop(): Promise<any> {
        return undefined;
    }
}
