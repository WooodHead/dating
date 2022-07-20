import { Purchase, PurchaseDocument } from './purchase.schema';
import { IRule } from '../product/rules/IRule';
import { ISubscription } from '../product/rules/subscription/ISubscription';

export type PurchaseCollection = {subscription: PurchaseDocument | Purchase, rule: IRule & ISubscription}
