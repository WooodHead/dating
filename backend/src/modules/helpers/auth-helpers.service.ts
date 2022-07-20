import { ExecutionContext, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersDocuments } from '../users/schemas/users.schema';
import { Types } from 'mongoose';
import { LoginResponse } from '../auth/auth.type';
import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { Purchase, PurchaseDocument } from '../payment/purchase/purchase.schema';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthHelpersService {

    public static getVariableFromContext<T>(context: ExecutionContext, varName: string): T {

        const body = context.switchToHttp().getRequest().body[varName];

        const params = context.switchToHttp().getRequest().params[varName];

        const query = context.switchToHttp().getRequest().query[varName];

        if(body) return body;

        if(params) return params;

        if(query) return query;

        throw new HttpException(`${varName} not found`, HttpStatus.BAD_REQUEST);
    }

    public static getUserIdFromBodyContext(context: ExecutionContext, varName: string): Types.ObjectId {
        try {
            const id = context.switchToHttp().getRequest().body[varName];

            if(!id) throw new HttpException(`${varName} not found`, HttpStatus.BAD_REQUEST);

            return Types.ObjectId(id);
        } catch (e) {
            throw new HttpException(`${varName} not found`, HttpStatus.BAD_REQUEST)
        }
    }

    public static createHash(pass: string): string {
        return bcrypt.hashSync(pass, 11);
    }

    public static compareHash(hash: string, pureString: string): Observable<boolean> {
        const final$: Subject<boolean> = new Subject();
        bcrypt.compare(pureString, hash, (err, result) => {
            if (err) return final$.error(err);
            final$.next(result);
            final$.complete();
        });
        return final$.pipe(first());
    }

    public static getUserDocFromContext(context: ExecutionContext): UsersDocuments {
        const user = context.switchToHttp().getRequest().user;

        if (!user) throw new UnprocessableEntityException('user dosent found in context')

        return user;
    }

    public static makeLoginResponse(user: UsersDocuments, profile: (UserProfileDocuments & any), token: string, subscription: PurchaseDocument | Purchase): LoginResponse {
        return {
            user: {phone: user.phone, email: user.email, isFirstLogin: user.isFirstLogin},
            profile,
            token,
            subscription
        };
    }

    public static transformToObjectIdOrUndefined(val): Types.ObjectId {
        try {
            return Types.ObjectId(val);
        } catch (e) {
            return undefined;
        }
    }

    public static transformToObjectIdOrHttpError(val): Types.ObjectId {
        try {
            return Types.ObjectId(val);
        } catch (e) {
            throw new HttpException('Incorrect objectId value', HttpStatus.BAD_REQUEST);
        }
    }
}
