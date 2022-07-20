import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TokenService } from '../../auth/token/token.service';
import { first } from 'rxjs/operators';
import { TokenTypeEnum } from '../../auth/token/enums/tokenTypes.enum';
import { PasswordResetByTokenEvent } from '../../users/events/password-reset-by-token.event';
import { mergeMap } from 'rxjs';
import { EmailService } from '../email.service';
import { EmailHelper } from '../../helpers/email.helper';

@Injectable()
export class PasswordEventListener {

    private logger: Logger = new Logger('PasswordChangeListener');

    public constructor(
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService
    ) {}

    @OnEvent(PasswordResetByTokenEvent.eventName)
    handle({user, profile}: PasswordResetByTokenEvent) {
        return this.tokenService.createTokenByType(user, TokenTypeEnum.resetPassword).pipe(
            mergeMap(token => this.emailService.sendEmail({
                from: EmailHelper.getEmailDomain(user.host).supportEmail,
                to: [user.email],
                subject: 'Password reset',
                template: 'reset_password',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name: profile.name,
                    token: token,
                    domain: EmailHelper.generateUrl(EmailHelper.getEmailDomain(user.host), user.host)
                })
            }, user.host)),
            first()
        ).subscribe({
            error: (e) => this.logger.error(e)
        });
    }

}
