import { Body, Controller, HttpCode, HttpException, HttpStatus, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { TokenService } from '../auth/token/token.service';
import { ResetPassByTokenDto } from './dto/reset-pass-by-token.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ReqToken, User } from './decorators/user.decorator';
import { UsersDocuments } from './schemas/users.schema';
import { combineLatest, concatMap, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { SendEmailForResetPassDto } from './dto/send-email-for-reset-pass.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResetPassDto } from './dto/reset-pass.dto';
import { AuthService } from '../auth/auth.service';
import { ChangeEmailDto } from './dto/change-email.dto';
import { PasswordResetByTokenEvent } from './events/password-reset-by-token.event';
import { EmailChangedEvent, EmailChangedOldEmailEvent } from './events/email-changed.event';
import { UserProfileService } from './user-profile/user-profile.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginResponse } from '../auth/auth.type';
import { VerificationGuard } from '../../guards/verification.guard';
import { TokenDocuments } from '../auth/token/schemas/token.schema';
import { TokenTypeEnum } from '../auth/token/enums/tokenTypes.enum';
import { AuthHelpersService } from '../helpers/auth-helpers.service';
import { PaymentService } from '../payment/payment.service';

@ApiTags('User')
@Controller('user')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly eventEmitter: EventEmitter2,
        private readonly authService: AuthService,
        private readonly profileService: UserProfileService,
        private readonly paymentService: PaymentService
    ) {}

    @HttpCode(200)
    @UseGuards(VerificationGuard)
    @Post('email-verification')
    public verificationEmail(@ReqToken() token: TokenDocuments, @Request() req): Observable<LoginResponse> {

        const userCollection = (token.type == TokenTypeEnum.emailVerification)

            ? this.authService.getRegistrationData({_id: token.user}).pipe(
                switchMap(rawUser => this.usersService.createUser({...rawUser.toObject(), isConfirmed: true})),
                switchMap(collection => this.authService.deleteRegistrationData(collection.user.email).pipe(map(() => collection)))
            )

            : combineLatest({
                user: this.usersService.findUserByParam({_id: token.user}).pipe(
                    switchMap(user => this.usersService.emailVerification(user)),
                ),
                profile: this.profileService.findProfileByParam({user: token.user})
            });

        return userCollection.pipe(
            switchMap(userCollection => combineLatest({
                tokenDelete: this.tokenService.deleteUserTokensByType(token.user, token.type),
                user: this.usersService.markFirstLogin(userCollection.user).pipe(
                    map(() => userCollection.user)
                ),
                profile: of(userCollection.profile),
                token: this.tokenService.createLoginToken(userCollection.user, req.headers['user-agent']),
                subscription: this.paymentService.getActiveSubscription(userCollection.user._id).pipe(map(collection => collection.subscription))
            })),
            map(data => AuthHelpersService.makeLoginResponse(data.user, data.profile, data.token, data.subscription)),
        )
    }

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @ApiBody({type: ChangeEmailDto})
    @Post('change-email')
    public changeEmail(@User() authUser: UsersDocuments, @Body() dto: ChangeEmailDto) {
        return this.usersService.findUserByParam({_id: authUser._id}).pipe(
            switchMap(user => this.usersService.emailChange(user, dto.email).pipe(
                switchMap(user => this.tokenService.deleteAllUserTokens(user._id).pipe(
                    tap(() => this.eventEmitter.emit(EmailChangedOldEmailEvent.eventName, new EmailChangedOldEmailEvent(authUser))),
                    tap(() => this.eventEmitter.emit(EmailChangedEvent.eventName, new EmailChangedEvent(user))),
                )),
                map(() => ({message: 'email has been changed'}))
            ))
        )

    }

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @ApiBody({type: ResetPassDto})
    @Post('reset-password')
    public resetPassword(@User() authUser: UsersDocuments, @Body() dto: ResetPassDto) {
        return AuthHelpersService.compareHash(authUser.password, dto.old_password).pipe(
            switchMap(result => (result) ? of(authUser) : throwError(() => new HttpException('Incorrect old password', HttpStatus.BAD_REQUEST))),
            switchMap(() => this.usersService.updateUserPass(authUser._id, dto.password)),
            map(() => ({message: 'password has been changed'}))
        )
    }

    @UseGuards(VerificationGuard)
    @ApiBody({type: ResetPassByTokenDto})
    @Post('reset-password/token')
    public resetPasswordByToken(@ReqToken() token: TokenDocuments, @Body() dto: ResetPassByTokenDto) {
        return this.usersService.updateUserPass(token.user, dto.password).pipe(
            concatMap(user => this.tokenService.deleteAllUserTokens(user._id)),
            map(() => ({message: 'password has been changed'}))
        )
    }

    @HttpCode(200)
    @ApiBody({type: SendEmailForResetPassDto})
    @Post('reset-password/token/send')
    public sendEmailForResetPassword(@Body() dto: SendEmailForResetPassDto) {
        return this.usersService.findUserByParam({email: dto.email}).pipe(
            switchMap(user => this.profileService.findProfileByParam({user: user._id}).pipe(
                tap(profile => this.eventEmitter.emit(PasswordResetByTokenEvent.eventName, new PasswordResetByTokenEvent(user, profile))),
            )),
            map(() => {return {message: 'Email was sent'}})
        )
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiBody({type: UpdateUserDto})
    @Patch()
    public updateUser(@User() authUser: UsersDocuments, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser({
                phone: (dto.phone) ? dto.phone : undefined
            },
            {_id: authUser._id}
        ).pipe(
            map(user => ({
                email: user.email,
                phone: user.phone
            }))
        )
    }
}
