import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Token, TokenDocuments } from './schemas/token.schema';
import { concatMap, from, map, mergeMap, Observable, of, switchMap, throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UsersDocuments } from '../../users/schemas/users.schema';
import { LoginToken, TokenType } from './types/itoken.type';
import * as moment from 'moment';
import { TokenTypeEnum } from './enums/tokenTypes.enum';
import * as jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';
import { FileService } from '../../file/file.service';
import { RegistrationDocument } from '../registration.schema';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';
import { AuthHelpersService } from '../../helpers/auth-helpers.service';

@Injectable()
export class TokenService {
    public constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocuments>,
        private jwtService: JwtService
    ) {
    }

    public getToken(user: Types.ObjectId, fingerprint: string, type: TokenTypeEnum): Observable<TokenDocuments> {
        return from(this.tokenModel.findOne({fingerprint, type}).exec()).pipe(
            concatMap(token => (token) ? of(token) : throwError(() => new UnauthorizedException()))
        );
    }

    public getTokenByFilter(filter: FilterQuery<TokenDocuments>): Observable<TokenDocuments> {
        return MongooseHelpersService.findOneOrError(this.tokenModel, filter);
    }

    public createLoginToken(user: UsersDocuments, fingerprint: string): Observable<string> {

        const _fingerprint = AuthHelpersService.createHash(fingerprint);

        const token = this.jwtService.sign({user, type: TokenTypeEnum.login, fingerprint: _fingerprint} as LoginToken);

        return from(this.tokenModel.create({
            user: user._id,
            fingerprint: _fingerprint,
            type: TokenTypeEnum.login
        })).pipe(
            map(() => token)
        )
    }

    public createTokenByType(user: UsersDocuments | RegistrationDocument, type: TokenTypeEnum): Observable<string> {

        const init_at = moment().unix();

        const fingerprint = AuthHelpersService.createHash(user.email);

        const expired_at = moment().add(10, 'days').unix();

        const token = this.jwtService.sign({email: user.email, type, fingerprint} as TokenType, {expiresIn: expired_at});

        const _model = new this.tokenModel({
            user: user._id,
            type,
            expired_at,
            init_at,
            fingerprint,
            email: user.email
        });

        return from(this.tokenModel.findOne({user: user._id, type}).exec()).pipe(
            map(model => {
                if (!model) return _model;
                model.expired_at = expired_at;
                model.init_at = init_at;
                model.fingerprint = fingerprint;
                model.email = user.email;
                return model;
            }),

            mergeMap(model => from(model.save())),

            map(() => token)
        )
    }

    deleteAllUserTokens(_id: Types.ObjectId): Observable<any> {
        return from(this.tokenModel.deleteMany({user: _id}));
    }

    deleteUserTokens(token: string): Observable<any> {
        return from(this.tokenModel.deleteOne({token}).exec());
    }

    public deleteUserTokensByType(userId: Types.ObjectId, type: TokenTypeEnum): Observable<any> {
        return from(this.tokenModel.deleteOne({type, user: userId}));
    }

    public validateTypesToken(token: string, expectTypeTokens: TokenTypeEnum[]): Observable<TokenDocuments> {
        return of(token).pipe(
            switchMap(token => of(
                jsonwebtoken.verify(token,
                    fs.readFileSync(FileService.publicKeyPemPath, 'utf8'), {
                        algorithms: ['RS256']
                    }
                )
            )),
            switchMap((payload: TokenType) => this.getTokenByFilter({email: payload.email,fingerprint: payload.fingerprint, type: {$in: expectTypeTokens}}))
        )
    }

    public validateLoginToken(token: string): Observable<TokenDocuments> {
        return of(token).pipe(
            switchMap(token => of(
                jsonwebtoken.verify(token,
                    fs.readFileSync(FileService.publicKeyPemPath, 'utf8'), {
                        algorithms: ['RS256']
                    }
                )
            )),
            switchMap((payload: LoginToken) => this.getTokenByFilter({user: Types.ObjectId(payload.user._id),fingerprint: payload.fingerprint, type: TokenTypeEnum.login}))
        )
    }
}
