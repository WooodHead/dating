import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersDocuments } from '../users/schemas/users.schema';
import { Seeder } from 'nestjs-seeder';
import { FileService } from '../file/file.service';
import { Languages } from '../addition-data/schemas/languages.schema';
import { Nationality } from '../addition-data/schemas/nationality.schema';
import { UserProfile, UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { Location } from '../addition-data/schemas/location.schema';
import { FileHelperService } from '../helpers/file-helper.service';
import * as fs from 'fs';
import * as path from 'path';
import { combineLatest, concatMap, from, lastValueFrom, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { UsersService } from '../users/users.service';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import FileSystemAdapter from '../file/adapter/FileSystem.adapter';
import * as moment from 'moment';
import * as faker from 'faker';

type RowUser = {
    email: string,
    password: string,
    host: string,
    name: string,
    location: string,
    nationality: string,
    languages: string[],
    bio: string,
    status: string,
    gender: string,
    ethnic: string,
    profession: string,
    bodyType: string,
    hairType: string,
    hairColor: string,
    weight: number,
    height: number,
    diet: string,
    smoker: string,
    alcohol: string,
    eyes: string,
    hair: string,
    preference: string,
    professional: string
    dob: string
}

@Injectable()
export class UsersSeeder implements Seeder {
    constructor(
        @InjectModel(User.name) private readonly user: Model<User>,
        @InjectModel(UserProfile.name) private readonly profile: Model<UserProfile>,
        @InjectModel(Languages.name) private readonly lang: Model<Languages>,
        @InjectModel(Nationality.name)
        private readonly nationality: Model<Nationality>,
        private readonly usersService: UsersService,
        private readonly userProfileService: UserProfileService,
        private readonly fileService: FileService,
        @InjectModel(Location.name) private readonly location: Model<Location>,
    ) {}

    async seed(): Promise<any> {

        const users = JSON.parse(
            String(
                fs.readFileSync(path.resolve(FileService.storagePath, 'seed-data', 'users.json')),
            ),
        );

        return await lastValueFrom(from(users).pipe(
            concatMap((rowUser: RowUser) =>
                this.usersService.createUserModel(rowUser.email, rowUser.password, rowUser.host, faker.random.number(), true).pipe(
                    map(userModel => ({rowUser, userModel}))
                )
            ),

            concatMap(data => this.generateUserProfile(data.rowUser, data.userModel, true).pipe(
                map(profile => ({...data, profile}))
            )),

            concatMap(data => this.updateUserModel(data.userModel, data.profile).pipe(
                map(user => ({...data, userModel: user}))
            )),

            mergeMap(data => this.uploadAvatars(data.profile))
        ))
    }

    async drop(): Promise<any> {
        return (
            (await this.user.deleteMany()) && (await this.profile.deleteMany())
        );
    }

    private generateUserProfile(userRowData: RowUser, userModel: UsersDocuments, isBoot = false): Observable<UserProfileDocuments> {
        return combineLatest({
            location: from(this.location.findOne({cityName: userRowData.location})),
            nationality: from(this.nationality.findOne({name: userRowData.nationality})),
            languages: of(userRowData.languages.map(lang => from(this.lang.findOne({name: lang})))).pipe(
                mergeMap(arr => combineLatest(arr))
            )
        }).pipe(
            switchMap(result => of({
                name: userRowData.name,
                bio: userRowData.bio,
                dob: moment(userRowData.dob, 'DD-MM-YYYY', true).toDate(),
                status: userRowData.status,
                gender: userRowData.gender,
                ethnic: userRowData.ethnic,
                profession: userRowData.profession,
                bodyType: userRowData.bodyType,
                hairType: userRowData.hairType,
                hairColor: userRowData.hairColor,
                weight: userRowData.weight,
                height: userRowData.height,
                diet: userRowData.diet,
                smoker: userRowData.smoker,
                alcohol: userRowData.alcohol,
                eyes: userRowData.eyes,
                hair: userRowData.hair,
                preference: userRowData.preference,
                professional: userRowData.professional,
                isConfirmed: true,
                user: userModel._id,
                location: result.location._id,
                nationality: result.nationality._id,
                languages: result.languages.map(lang => lang._id),
                isBoot
            })),
            switchMap(profile => this.userProfileService.createUserProfile(profile)),
        )
    }

    private updateUserModel(userModel: UsersDocuments, profileModel: UserProfileDocuments): Observable<UsersDocuments> {
        userModel.profile = profileModel._id;
        return from(userModel.save())
    }

    private uploadAvatars(profile: UserProfileDocuments): Observable<any> {
        return this.fileService.readDirectory(path.resolve(FileService.storagePath, 'usersPhotoExamples', profile.name, 'avatar')).pipe(
            map(fileNames => fileNames[0]),
            switchMap(fileName => this.fileService.takeImgBufferFromRawData(
                '',
                '',
                fileName
            )),
            switchMap(buffer => this.fileService.uploadImg(buffer, FileSystemAdapter.targetDir, 'avatars', FileHelperService.createFileName('jpg'))),
            map(path => {
                return {
                    avatarPath: this.fileService.getImgUrl(path, FileHelperService.mediumImgPrefix),
                    smAvatarPath: this.fileService.getImgUrl(path, FileHelperService.smallImgPrefix),
                    originalAvatarPath: path,
                }
            }),
            switchMap(paths =>
                this.userProfileService.updateUserProfile(profile.user, paths)
            ),
        )
    }
}
