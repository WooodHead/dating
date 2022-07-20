import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TokenService } from '../../auth/token/token.service';
import { TokenTypeEnum } from '../../auth/token/enums/tokenTypes.enum';
import { combineLatest, mergeMap, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { EmailService } from '../email.service';
import { EmailHelper } from '../../helpers/email.helper';
import { SendVerificationEmail } from '../event/email';
import { UsersDocuments } from '../../users/schemas/users.schema';
import { RegistrationDocument } from '../../auth/registration.schema';
import { UserProfileDocuments } from '../../users/user-profile/schemas/userProfile.schema';
import { EmailChangedEvent, EmailChangedOldEmailEvent } from '../../users/events/email-changed.event';
import { UserProfileService } from '../../users/user-profile/user-profile.service';

@Injectable()
export class UserEmailListener {

    private logger: Logger = new Logger('RegistrationCompleteListener');

    public constructor(
        private readonly profileService: UserProfileService,
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService
    ) {}

    @OnEvent(SendVerificationEmail.eventName)
    public sendVerificationEmail({rowData}: SendVerificationEmail) {
        return this.tokenService.createTokenByType(rowData, TokenTypeEnum.emailVerification).pipe(
            mergeMap(token => this.sendEmail(rowData, rowData, token)),
            first()
        ).subscribe({
            error: (e) => this.logger.error(e)
        });
    }

    @OnEvent(EmailChangedEvent.eventName)
    public changeEmail({user}: EmailChangedEvent) {
        combineLatest({
            token: this.tokenService.createTokenByType(user, TokenTypeEnum.emailChanged),
            userProfile: this.profileService.findProfileByParam({user: user._id})
        }).pipe(
            mergeMap(data => this.sendEmail(user, data.userProfile, data.token)),
            first()
        ).subscribe({
            error: (e) => this.logger.error(e)
        });
    }

    @OnEvent(EmailChangedOldEmailEvent.eventName)
    public changeEmailOldEmail({user}: EmailChangedOldEmailEvent) {
        this.emailService.sendEmail({
            from: EmailHelper.getEmailDomain(user.host).supportEmail,
            to: [user.email],
            text: `Hi Your email was changed. If you didn’t change your email, write to support`,
            subject: 'Change Email'
        }, user.host)
    }

    private sendEmail(user: UsersDocuments | RegistrationDocument, profile: UserProfileDocuments | RegistrationDocument, token: string): Observable<any> {
        return this.emailService.sendEmail({
            from: EmailHelper.getEmailDomain(user.host).supportEmail,
            to: [user.email],
            subject: 'Email verification',
            template: 'confirming',
            'h:X-Mailgun-Variables': JSON.stringify({
                email: user.email,
                name: profile.name,
                token,
                domain: EmailHelper.generateUrl(EmailHelper.getEmailDomain(user.host), user.host)
            })
        }, user.host)
    }
}
