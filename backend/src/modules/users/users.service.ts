import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UsersDocuments } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { concatMap, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthHelpersService } from '../helpers/auth-helpers.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { TokenService } from '../auth/token/token.service';
import { DeactivateReasonsEnum } from './enums/user.enum';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegistrationComplete } from './events/user.event';
import { UserProfile, UserProfileDocuments } from './user-profile/schemas/userProfile.schema';


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UsersDocuments>,
        private readonly profileService: UserProfileService,
        private readonly tokenService: TokenService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    public createUserDocObj(user: User): UsersDocuments {
        return new this.userModel(user);
    }

    public createUser(dto: User & UserProfile): Observable<{ user: UsersDocuments, profile: UserProfileDocuments }> {

        let userProfileDoc: UserProfileDocuments;

        return from(this.userModel.create(dto)).pipe(
            concatMap(user => this.profileService.createUserProfile({
                ...dto,
                user: user._id
            }).pipe(
                tap(profile => userProfileDoc = profile),
                concatMap(profile => {
                    user.profile = profile._id;
                    this.eventEmitter.emit(UserRegistrationComplete.eventName, new UserRegistrationComplete(user, profile));
                    return from(user.save());
                }),
                map(user => ({
                    user, profile: userProfileDoc
                }))
            ))
        )
    }

    public createUserModel(email: string, password: string, host: string, phone: number = undefined, isConfirmed = false): Observable<UsersDocuments> {
        return from(this.userModel.create({
            email,
            password: AuthHelpersService.createHash(password),
            host,
            phone,
            isConfirmed
        }))
    }

    public findUserByParam(param: any): Observable<UsersDocuments> {
        return from(this.userModel.findOne(param)).pipe(
            mergeMap(user => (user) ? of(user) : throwError(() => new HttpException('user dosen\'t found', HttpStatus.BAD_REQUEST)))
        );
    }

    public updateUserPass(userId: Types.ObjectId, newPass: string): Observable<any> {
        return from(this.userModel.updateOne({_id: userId}, {password: AuthHelpersService.createHash(newPass)}))
    }

    public emailChange(user: UsersDocuments, newEmail: string): Observable<UsersDocuments> {
        user.email = newEmail;
        user.isConfirmed = false;
        return from(user.save());
    }

    public emailVerification(user: UsersDocuments): Observable<UsersDocuments> {
        user.isConfirmed = true;
        return from(user.save());
    }

    public extractUserOrNullFromRequest(request: Request): Observable<UsersDocuments | null> {
        return this.tokenService.validateLoginToken(ExtractJwt.fromAuthHeaderAsBearerToken()(request)).pipe(
            switchMap(token => this.findUserByParam({_id: token.user})),
            catchError(() => of(null))
        )
    }

    public markFirstLogin(user: UsersDocuments): Observable<any> {
        return from(this.userModel.updateOne({_id: user._id}, {isFirstLogin: false}))
    }

    public deactivate(userId: Types.ObjectId, reason: DeactivateReasonsEnum): Observable<any> {
        return from(this.userModel.updateOne({_id: userId}, {isActive: false, deactivateReason: reason}))
    }

    public updateUser(update: UpdateQuery<UsersDocuments>, filter: FilterQuery<UsersDocuments>): Observable<UsersDocuments> {
        return MongooseHelpersService.findAndUpdate(this.userModel, update, filter).pipe(
            map(data => (data.length) ? data[0] : null)
        )
    }
}
