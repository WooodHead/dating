import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Request,
    UnprocessableEntityException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token/token.service';
import { combineLatest, map, Observable, of, tap, throwError } from 'rxjs';
import { Token } from './token/decorators/token.decorator';
import { IsActiveGuard } from '../../guards/is-active.guard';
import { catchError, switchMap } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { RegistrationDto } from './dto/registration.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { MongooseHelpersService, UsersProfilePopulateEnums } from '../helpers/mongoose-helpers.service';
import { LoginResponse, RegistrationResponse } from './auth.type';
import { UsersDocuments } from '../users/schemas/users.schema';
import { AuthHelpersService } from '../helpers/auth-helpers.service';
import { AuthService } from './auth.service';
import { SendVerificationEmail } from '../email/event/email';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { TokenTypeEnum } from './token/enums/tokenTypes.enum';
import { EmailChangedEvent } from '../users/events/email-changed.event';
import { PaymentService } from '../payment/payment.service';
import { LendingRegistrationDto } from './dto/lending-registration.dto';
import { Request as ERequest } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    private logger: Logger = new Logger('AuthController');

    public constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly eventEmitter: EventEmitter2,
        private readonly authService: AuthService,
        private readonly profileService: UserProfileService,
        private readonly paymentService: PaymentService
    ) {}
    
    @HttpCode(200)
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    @ApiBody({type: LoginDto})
    @UseGuards(LocalAuthGuard, IsActiveGuard)
    @Post('login')
    public login(@Request() req): Observable<LoginResponse> {
        return combineLatest({
            user: of(req.user).pipe(
                switchMap((user: UsersDocuments) => (user.isConfirmed) ? of(user) : throwError(() => new HttpException('need verification', HttpStatus.I_AM_A_TEAPOT)))
            ),
            profile: this.profileService.findProfileByParam({user: req.user._id}).pipe(
                switchMap(profile =>
                    MongooseHelpersService.wrapPopulate<UserProfileDocuments>(profile, Object.values(UsersProfilePopulateEnums))
                )
            ),
            token: this.tokenService.createLoginToken(req.user, req.headers['user-agent']),
            subscription: this.paymentService.getActiveSubscription(req.user._id).pipe(map(collection => collection.subscription))
        }).pipe(
            map(data => AuthHelpersService.makeLoginResponse(data.user, data.profile, data.token, data.subscription))
        )
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    public logout(@Token() token: string, @Request() req) {
        return this.tokenService.deleteUserTokens(token).pipe(
            map(() => {
                return {message: 'logout'}
            })
        );
    }

    @ApiBody({type: RegistrationDto})
    @UsePipes(new ValidationPipe({transform: true}))
    @Post('registration')
    registration(@Body() dto: RegistrationDto, @Request() req: ERequest): Observable<RegistrationResponse> {

        const host = req.headers.host;

        return this.authService.saveToRegistrationData({...dto, host}).pipe(
            tap(data => this.eventEmitter.emit(SendVerificationEmail.eventName, new SendVerificationEmail(data))),
            map(data => ({
                user: {phone: data.phone, email: data.email},
                profile: {name: data.name, gender: data.gender, dob: data.dob, preference: data.preference}
            })),

            catchError(e => {
                this.logger.error(e);
                throw new HttpException('incorrect data', HttpStatus.BAD_GATEWAY)
            })
        )
    }

    @ApiBody({type: LendingRegistrationDto})
    @Post('registration/landing')
    landingRegistration(@Body() {email, password}: LendingRegistrationDto, @Request() req: ERequest): Observable<LoginResponse> {

        return this.authService.generateUserRegistrationData(email,password, req.headers.host).pipe(
            switchMap(data => this.usersService.createUser({...data, isConfirmed: true})),
            switchMap(userCollection => combineLatest({
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

    @HttpCode(200)
    @ApiBody({type: ResendVerificationEmailDto})
    @Post('resend/email-verification')
    public resendEmailVerification(@Body() {email}: ResendVerificationEmailDto) {
        return this.tokenService.getTokenByFilter({email}).pipe(
            switchMap(token => ((token.type == TokenTypeEnum.emailVerification) || (token.type == TokenTypeEnum.emailChanged))
                ? this.tokenService.deleteUserTokensByType(token.user, token.type).pipe(map(() => token))
                : throwError(() => new UnprocessableEntityException('token not found'))
            ),
            switchMap(tokenDoc => (tokenDoc.type == TokenTypeEnum.emailVerification)

                ? this.authService.getRegistrationData({_id: tokenDoc.user}).pipe(
                    tap(doc => this.eventEmitter.emit(SendVerificationEmail.eventName, new SendVerificationEmail(doc)))
                )

                : this.usersService.findUserByParam({_id: tokenDoc.user}).pipe(
                    tap(doc => this.eventEmitter.emit(EmailChangedEvent.eventName, new EmailChangedEvent(doc))),
                )
            ),

            map(() => ({message: 'email has been re-sent'}))
        )
    }
}
