import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { lastValueFrom, mergeMap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../users/schemas/users.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({usernameField: 'email'});
    }

    validate(email: string, password: string): Promise<User> {
        const user$ = this.authService.validateUser(email, password).pipe(
            catchError(() => of(null)),

            mergeMap(result => (result) ? of(result) : this.authService.getRegistrationData({email}).pipe(
                catchError(() => of(null)),
                mergeMap(result => (!result) ? of(null) : throwError(() => new HttpException('need to validate', HttpStatus.I_AM_A_TEAPOT)))
            )),

            mergeMap(result => (result) ? of(result) : throwError(() => new UnauthorizedException())),
        )

        return lastValueFrom(user$);
    }
}
