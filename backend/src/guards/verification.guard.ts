import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { map, Observable, throwError, } from 'rxjs';
import { TokenService } from '../modules/auth/token/token.service';
import { catchError } from 'rxjs/operators';
import { ExtractJwt } from 'passport-jwt';
import { TokenTypeEnum } from '../modules/auth/token/enums/tokenTypes.enum';

@Injectable()
export class VerificationGuard implements CanActivate {

    private logger: Logger = new Logger('VerificationGuard');

    public constructor(
        protected tokenService: TokenService
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());

        if (!token) return false;

        return this.tokenService.validateTypesToken(token, [TokenTypeEnum.emailVerification, TokenTypeEnum.emailChanged, TokenTypeEnum.resetPassword]).pipe(
            map(_token => {
                context.switchToHttp().getRequest().tokenPayload = _token;
                return !!(_token)
            }),
            catchError((e) => throwError(() => new UnauthorizedException(e.message)))
        )
    }

}
