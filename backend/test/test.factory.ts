import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { AuthController } from '../src/modules/auth/auth.controller';
import { DataSet } from './app.e2e-spec';
import * as faker from 'faker';
import {
    EyesEnum,
    GenderEnum,
    HairEnum,
    ProfessionalEnum,
    StatusEnum,
    UserPreferenceEnum
} from '../src/modules/users/user-profile/enums/userProfile.enum';
import * as moment from 'moment';
import * as mocks from 'node-mocks-http'
import { RegistrationResponse } from '../src/modules/auth/auth.type';
import { UpdateProfileDto } from '../src/modules/users/user-profile/dto/update-profile.dto';
import { AlbumService } from '../src/modules/album/album.service';
import { AlbumTypeEnum } from '../src/modules/album/enums/album.enum';
import { UserProfileService } from '../src/modules/users/user-profile/user-profile.service';
import { AlbumDocuments } from '../src/modules/album/schemas/album.schema';
import { AlbumShareService } from '../src/modules/album/album-share/album-share.service';
import { TokenService } from '../src/modules/auth/token/token.service';
import { UsersDocuments } from '../src/modules/users/schemas/users.schema';

export type UserWithAlbums = {
    user: RegistrationResponse & { token: string },
    privateAlbum: AlbumDocuments,
    publicAlbum: AlbumDocuments
}

export type UsersWithSharedAlbum = {
    usersWithAlbums: UserWithAlbums,
    secondUser: RegistrationResponse & { token: string },
    // permission: AlbumSharePermissionDocuments
}

export class UserFactory {

    private authController$: Observable<AuthController> = this.data$.pipe(
        map(data => data.moduleRef.get<AuthController>(AuthController))
    )

    private tokenService$: Observable<TokenService> = this.data$.pipe(
        map(data => data.moduleRef.get<TokenService>(TokenService))
    )

    private albumService$: Observable<AlbumService> = this.data$.pipe(
        map(data => data.moduleRef.get<AlbumService>(AlbumService))
    )

    private userProfileService$: Observable<UserProfileService> = this.data$.pipe(
        map(data => data.moduleRef.get<UserProfileService>(UserProfileService))
    )

    private albumShareService$: Observable<AlbumShareService> = this.data$.pipe(
        map(data => data.moduleRef.get<AlbumShareService>(AlbumShareService))
    )

    constructor(
        private readonly data$: Observable<DataSet>
    ) {}

    public static generateUserProfileUpdateData(): UpdateProfileDto {
        return {
            gender: faker.random.arrayElement(Object.values(GenderEnum)),
            eyes: faker.random.arrayElement(Object.values(EyesEnum)),
            professional: faker.random.arrayElement(Object.values(ProfessionalEnum)),
            hair: faker.random.arrayElement(Object.values(HairEnum)),
            status: faker.random.arrayElement(Object.values(StatusEnum)),
            name: faker.name.findName()
        }
    }

    public createUser(): Observable<RegistrationResponse & { token: string }> {
        return this.authController$.pipe(
            switchMap(controller => controller.registration({
                gender: faker.random.arrayElement(Object.values(GenderEnum)),
                dob: moment(faker.date.between('1970', '2010'), 'faker').toDate(),
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: 'admin12345',
                preference: faker.random.arrayElement(Object.values(UserPreferenceEnum)),
            }, mocks.createRequest())),
            switchMap(response => this.tokenService$.pipe(
                switchMap(service => service.createLoginToken({
                    email: response.user.email,
                    _id: response.profile.user
                } as UsersDocuments).pipe(map(data => data.token))),
                map(token => ({
                    ...response,
                    token
                }))
            ))
        )
    }

    public createUsersWithAlbums(): Observable<UserWithAlbums> {
        return this.createUser().pipe(
            switchMap(user => combineLatest({
                user: of(user),
                privateAlbum: this.albumService$.pipe(
                    switchMap(album => album.createNewAlbum({
                        ownerId: user.profile.user,
                        name: faker.lorem.word(),
                        type: AlbumTypeEnum.private
                    }))
                ),
                publicAlbum: this.albumService$.pipe(
                    switchMap(album => album.createNewAlbum({
                        ownerId: user.profile.user,
                        name: faker.lorem.word(),
                        type: AlbumTypeEnum.public
                    }))
                )
            }))
        )
    }

    public createUsersWithSharedAlbums(): Observable<UsersWithSharedAlbum> {
        return combineLatest({
            usersWithPrivateAlbum: this.createUsersWithAlbums(),
            secondUser: this.createUser()
        }).pipe(
            switchMap(data => combineLatest({
                usersWithAlbums: of(data.usersWithPrivateAlbum),
                secondUser: of(data.secondUser),
                // permission: this.albumShareService$.pipe(
                //     switchMap(service => service.createSharePermissionToAlbum(
                //         data.usersWithPrivateAlbum.user.profile.user,
                //         data.secondUser.profile.user,
                //         data.usersWithPrivateAlbum.privateAlbum._id
                //     ))
                // )
            }))
        )
    }
}
