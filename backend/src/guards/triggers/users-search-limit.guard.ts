import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { map, Observable, of, switchMap, throwError, } from 'rxjs';
import { PaymentService } from '../../modules/payment/payment.service';
import { Types } from 'mongoose';
import { PurchaseCollection } from '../../modules/payment/purchase/purchase.type';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../../modules/auth/token/token.service';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class UsersSearchLimitGuard implements CanActivate {

    constructor(
        private readonly paymentService: PaymentService,
        private readonly tokenService: TokenService,
        private readonly userService: UsersService
    ) {}

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        return of(context.switchToHttp().getRequest().headers).pipe(
            switchMap(headers => (headers.authorization) ? of(headers.authorization.split(' ').pop()) : throwError(() => new UnauthorizedException())),
            switchMap(token => this.tokenService.validateLoginToken(token)),
            switchMap(token => this.userService.findUserByParam({_id: token.user})),
            switchMap(user => this.makeChange(this.paymentService.getActiveSubscription(user._id), context)),
            catchError(() => this.makeChange(this.paymentService.getActiveSubscription(Types.ObjectId()), context))
        )
    }

    private makeChange(collection$: Observable<PurchaseCollection>, context: ExecutionContext): Observable<boolean> {

        const offset = Number(context.switchToHttp().getRequest().query.offset);
        const take = Number(context.switchToHttp().getRequest().query.take);

        return collection$.pipe(
            switchMap(collection => collection.rule.userSearchResult({offset, take})),
            map(result => {
                context.switchToHttp().getRequest().query.offset = result.offset;
                context.switchToHttp().getRequest().query.take = result.take;
            }),
            map(() => true)
        )

    }

}
