import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { combineLatest, map, Observable, of, switchMap, throwError, } from 'rxjs';
import { PaymentService } from '../../modules/payment/payment.service';
import { AuthHelpersService } from '../../modules/helpers/auth-helpers.service';
import { MessagesService } from '../../modules/chat/messages/messages.service';

@Injectable()
export class ChatMessageLimitGuard implements CanActivate {

    constructor(
        private readonly paymentService: PaymentService,
        private readonly messageService: MessagesService
    ) {}

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const user = AuthHelpersService.getUserDocFromContext(context);

        const targetUserId = AuthHelpersService.getUserIdFromBodyContext(context, 'targetUserId');

        if (!targetUserId) throw new HttpException('chatLink dont found', HttpStatus.BAD_REQUEST);

        return this.paymentService.getActiveSubscription(user._id).pipe(
            switchMap(collection => combineLatest({
                firstMessageLimit: collection.rule.firstMessageToChatRoomCheck(this.messageService, user._id, targetUserId),
                messagesLimit: collection.rule.limitMessageToChatRoomCheck(this.messageService, user._id, targetUserId)
            })),
            map(results => (results.firstMessageLimit && results.messagesLimit)),
            switchMap(result => (result) ? of(result) : throwError(() => new HttpException('subscribe dont allow', HttpStatus.CONFLICT)))
        )
    }

}
