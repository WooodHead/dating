import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import { User } from '../../users/schemas/users.schema';
import { FileService } from '../../file/file.service';
import { TokenService } from '../token/token.service';
import { TokenTypeEnum } from '../token/enums/tokenTypes.enum';
import { Request } from 'express';
import { lastValueFrom, map, of, switchMap, throwError } from 'rxjs';
import { LoginToken } from '../token/types/itoken.type';
import { AuthHelpersService } from '../../helpers/auth-helpers.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        protected tokenService: TokenService,
        private readonly UserService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: fs.readFileSync(FileService.publicKeyPemPath, 'utf8'),
            algorithms: ['RS256'],
            passReqToCallback: true,
        });
    }

    public validate(req: Request, payload: LoginToken): Promise<User> {
        const user = this.tokenService.getToken(payload.user._id, payload.fingerprint, TokenTypeEnum.login).pipe(
            switchMap(() => AuthHelpersService.compareHash(payload.fingerprint, req.headers['user-agent'])),
            switchMap( result => (result) ? of(payload.user) : this.tokenService.deleteAllUserTokens(payload.user._id).pipe(
                switchMap(() => throwError(() => new UnauthorizedException())))
            ),
            map(user =>  this.UserService.createUserDocObj(user))
        )
        return lastValueFrom(user);
    }
}
