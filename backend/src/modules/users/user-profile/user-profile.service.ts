import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { UserProfile, UserProfileDocuments } from './schemas/userProfile.schema';
import { MongooseHelpersService } from '../../helpers/mongoose-helpers.service';
import { Place } from '../../addition-data/schemas/location.schema';
import { AdditionDataService } from '../../addition-data/addition-data.service';
import { MainSearchQuery } from '../../search/search.type';
import { bootProfile, DatasetForBootProfile } from './user-profile.type';
import * as faker from 'faker';

@Injectable()
export class UserProfileService {

    public constructor(
        @InjectModel(UserProfile.name) private readonly userProfileModel: Model<UserProfileDocuments>,
        private readonly additionalDataService: AdditionDataService
    ) {}

    public placeFill(doc: UserProfile | UserProfileDocuments): Observable<UserProfile | UserProfileDocuments> {

        if (!doc.location) return of(doc);

        return this.additionalDataService.getLocationByParam({_id: doc.location}).pipe(
            map(place => {
                doc.place = {
                    coordinates: [MongooseHelpersService.randomizeCord(place.location.coordinates[0]), MongooseHelpersService.randomizeCord(place.location.coordinates[1])],
                    type: place.location.type
                } as Place
                return doc;
            })
        )
    }

    public createUserProfile(profile: UserProfile): Observable<UserProfileDocuments> {
        return this.placeFill(profile).pipe(
            switchMap(_profile => from(this.userProfileModel.create(_profile)))
        );
    }

    public updateUserProfile(userId: Types.ObjectId, dto: UpdateQuery<UserProfile>): Observable<UserProfileDocuments> {
        return this.findProfileByParam({user: userId}).pipe(
            map(profile => Object.assign(profile, dto)),
            switchMap(_profile => this.placeFill(_profile)),
            switchMap(profile => MongooseHelpersService.findOneAndUpdate(this.userProfileModel, profile, {user: userId}))
        )
    }

    public findProfileByParam(params: FilterQuery<UserProfileDocuments>, filter = undefined): Observable<UserProfileDocuments> {
        return MongooseHelpersService.findOneOrError(this.userProfileModel, params, filter);
    }

    public findProfileWithDistance(targetUserId: Types.ObjectId, centerPoint: Place): Observable<{ profile: UserProfileDocuments, distance: number }> {
        return from(this.userProfileModel.aggregate([
            {
                $geoNear: {
                    near: centerPoint,
                    distanceField: 'distance',
                    spherical: true,
                    distanceMultiplier: 0.001
                }
            },
            {
                $match: {user: targetUserId}
            }
        ])).pipe(
            switchMap(data => (data.length) ? of(data[0]) : throwError(() => new UnprocessableEntityException('profile dosent exist'))),
            map(data => ({profile: new this.userProfileModel(data), distance: data.distance}))
        )
    }

    public findProfilesByParam(params: FilterQuery<UserProfileDocuments>, filter = undefined): Observable<UserProfileDocuments[]> {
        return from(this.userProfileModel.find(params, filter).exec());
    }

    public search(param: MainSearchQuery, limit, offset): Observable<{ profile: UserProfileDocuments, distance: number }[]> {

        const query = [

            {$match: {...param.$match}},

            {
                $lookup: {
                    from: 'users', localField: 'user', foreignField: '_id', as: '_user'
                }
            },

            {$unwind: {path: '$_user'}},

            {$match: {'_user.isActive': {$exists: true}}},

            {...param.$addFields},

            {...param.$sort},

            {$project: {_user: 0}},

            {$skip: offset},

            {$limit: limit},
        ]

        return of((param.$geoNear) ? [{...param.$geoNear}] : []).pipe(
            map(arr => arr.concat(query)),
            switchMap(arr => this.userProfileModel.aggregate<UserProfileDocuments>(arr)),
            map((items: any[]) => items.map(item => ({
                profile: new this.userProfileModel(item),
                distance: Math.floor(item.distance)
            })))
        )
    }

    public searchByName(name: string, excludedUsers: Types.ObjectId[], skip: number, take: number, filter = undefined): Observable<UserProfileDocuments[]> {
        const query = this.userProfileModel.find({
            name: new RegExp(`^${name}`, 'i'),
            user: {$nin: excludedUsers}
        }, filter).skip(Number(skip)).limit(Number(take)).exec();
        return from(query);
    }

    public changeOnlineStatus(userId: Types.ObjectId, isOnline: boolean): Observable<any> {
        return from(this.userProfileModel.updateOne({user: userId}, {$set: {online: isOnline}}).exec());
    }

    public populateUserBootProfile(dataset: DatasetForBootProfile, bootProfile: UserProfileDocuments): bootProfile {

        if(!bootProfile.isBoot) return {profile: bootProfile, distance: dataset.distance};

        bootProfile.location = dataset.locationId;

        return {profile: bootProfile, distance: faker.random.number({'min': 5, 'max': 20})};
    }
}
