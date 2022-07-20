import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Product, ProductDocument } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { from, map, Observable } from 'rxjs';
import { IRule } from './rules/IRule';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';
import { FreeSubscription } from './rules/subscription/free.subscription';
import { TrialSubscription } from './rules/subscription/trial.subscription';
import { PremiumSubscription } from './rules/subscription/premium.subscription';
import { ISubscription } from './rules/subscription/ISubscription';

@Injectable()
export class ProductService {

    private listOfSubscriptions: (IRule & ISubscription)[] = [
        new FreeSubscription(this.moduleRef),
        new TrialSubscription(this.moduleRef),
        new PremiumSubscription(this.moduleRef)
    ];

    public constructor(
        @InjectModel(Product.name) private readonly productDoc: Model<ProductDocument>,
        private moduleRef: ModuleRef,
    ) {}

    public createProduct(product: Product): Observable<ProductDocument> {
        return from(this.productDoc.create(product));
    }

    public getProductByParams(filter: FilterQuery<ProductDocument>, projection: any = undefined): Observable<{ doc: ProductDocument, rule: IRule }> {
        return MongooseHelpersService.findOneOrError(this.productDoc, filter, projection).pipe(
            map(doc => ({doc, rule: this.findSubscriptionRuleByName(doc.rule)}))
        )
    }

    public findSubscriptionRuleByName(name: string): IRule & ISubscription {

        const _rule = this.listOfSubscriptions.find(rule => rule.name == name);

        if (!_rule) throw new NotFoundException('rule dosent found')

        return _rule;
    }
}
