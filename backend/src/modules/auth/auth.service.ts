import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { catchError, first, switchMap } from 'rxjs/operators';
import { from, map, Observable, of, throwError } from 'rxjs';
import { User, UsersDocuments } from '../users/schemas/users.schema';
import { TokenService } from './token/token.service';
import { Socket } from 'socket.io';
import { Registration, RegistrationDocument } from './registration.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';
import { AuthHelpersService } from '../helpers/auth-helpers.service';
import { UserProfile } from '../users/user-profile/schemas/userProfile.schema';
import { AdditionDataService } from '../addition-data/addition-data.service';
import { GenderEnum, UserPreferenceEnum } from '../users/user-profile/enums/userProfile.enum';
import * as faker from 'faker'
import * as moment from 'moment'

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(Registration.name) private readonly registrationDoc: Model<RegistrationDocument>,
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly additionDataService: AdditionDataService,
    ) {}

    public validateUser(email: string, pass: string): Observable<User> {
        return this.usersService.findUserByParam({email}).pipe(
            switchMap(user => AuthHelpersService.compareHash(user.password, pass).pipe(
                switchMap(result => (result) ? of(user) : throwError(() => new HttpException('user doesn\'t match', HttpStatus.BAD_REQUEST)))
            ))
        );
    }

    public userFromWSHandshake(client: Socket): Observable<UsersDocuments> {
        return of(client.handshake.headers.authorization.split(' ').pop()).pipe(
            switchMap(token => this.tokenService.validateLoginToken(token)),
            switchMap(validatedToken => this.usersService.findUserByParam({_id: validatedToken.user})),
            catchError(() => throwError(() => new UnauthorizedException())),
            first()
        )
    }

    public saveToRegistrationData(rawData: Registration): Observable<RegistrationDocument> {
        const _rawData = {...rawData, password: AuthHelpersService.createHash(rawData.password)};
        return from(this.registrationDoc.create(_rawData));
    }

    public getRegistrationData(filter: FilterQuery<RegistrationDocument>): Observable<RegistrationDocument> {
        return MongooseHelpersService.findOneOrError(this.registrationDoc, filter)
    }

    public deleteRegistrationData(email: string): Observable<any> {
        return from(this.registrationDoc.deleteMany({email}));
    }

    public generateUserRegistrationData(email: string, password: string, host: string): Observable<User & UserProfile> {
        return this.additionDataService.getRandomLocation(1).pipe(
            map(location => ({
                email,
                    password: AuthHelpersService.createHash(password),
                    preference: UserPreferenceEnum.all,
                    name: faker.name.findName(),
                    dob: moment(faker.date.between('1970', '2010'), 'faker').toDate(),
                    gender: faker.random.arrayElement(Object.values(GenderEnum)),
                    location: location._id,
                    host,
                    isConfirmed: true
            }))
        )

    }
}
