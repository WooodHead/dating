import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Purchase, PurchaseDocument } from './purchase.schema';
import { from, mapTo, Observable, of } from 'rxjs';
import { Product } from '../product/product.schema';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';
import { catchError } from 'rxjs/operators';
import { ProductTypeEnum, SubscriptionEnum } from '../product/product.enum';
import * as moment from 'moment';

@Injectable()
export class PurchaseService {

    public constructor(
        @InjectModel(Purchase.name) private readonly purchaseDoc: Model<PurchaseDocument>,
    ) {}

    public generateFreeSubscriptionDoc(userId: Types.ObjectId): Purchase {
        return {
            user: userId,
            product: {
                name: SubscriptionEnum.free,
                dueDate: 0,
                rule: SubscriptionEnum.free,
                type: ProductTypeEnum.subscription
            } as Product,
            transaction: Types.ObjectId(),
            startAt: 0,
            endAt: 0,
            autoPay: null,
        } as Purchase;
    }

    public getPurchaseByParams(filter: FilterQuery<PurchaseDocument>, projection: any = undefined): Observable<PurchaseDocument> {
        return MongooseHelpersService.findOne(this.purchaseDoc, filter, projection);
    }

    public createPurchase(product: Product, userId: Types.ObjectId): Observable<PurchaseDocument> {
        return from(this.purchaseDoc.create({
            user: userId,
            product: product,
            transaction: Types.ObjectId(),
            startAt: moment().unix(),
            endAt: moment().unix() + product.dueDate,
            autoPay: moment().unix() + product.dueDate

        }))
    }

    public countPurchases(filter: FilterQuery<PurchaseDocument>): Observable<number> {
        return from(this.purchaseDoc.countDocuments(filter).exec());
    }

    public updatePurchase(filter: FilterQuery<PurchaseDocument>, update: UpdateQuery<PurchaseDocument>): Observable<boolean> {
        return from(this.purchaseDoc.updateOne(filter, update)).pipe(
            mapTo(true),
            catchError(() => of(false))
        )
    }
}
