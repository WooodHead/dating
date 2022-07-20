import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { Document, FilterQuery, Model, QueryOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { combineLatest, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import {mergeMap} from "rxjs/operators";
import * as faker from 'faker';

@Injectable()
export class MongooseHelpersService {

    public static randomizeCord(coordinate: number): number {
        const number = faker.random.number({min: 10, max: 90});
        const operation = faker.random.arrayElement(['', '-'])
        const result = (coordinate + Number(operation + '0.000' + number)).toFixed(5);
        return Number(result);
    }

    public static findOneOrError<T>(model: Model<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<T> {
        return from(model.findOne(filter, projection, options)).pipe(
            mergeMap(user => (user) ? of(user) : throwError(() => new HttpException(`${model.modelName} not found`, HttpStatus.NOT_FOUND)))
        );
    }

    public static findOne<T>(model: Model<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<T> {
        return from(model.findOne(filter, projection, options));
    }

    public static findAndUpdate<T>(model: Model<T>, updatedDate: UpdateQuery<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<T[]> {
        return from(model.updateMany(filter, updatedDate, options)).pipe(
            switchMap((result: UpdateWriteOpResult) => (result.ok > 0) ? from(model.find(filter, projection, options).exec()) : of([]))
        )
    }

    public static findOneAndUpdate<T>(model: Model<T>, updatedDate: UpdateQuery<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<T> {
        return from(model.updateOne(filter, updatedDate, options)).pipe(
            switchMap((result: UpdateWriteOpResult) => (result.ok > 0) ? from(model.findOne(filter, projection, options).exec()) : of(undefined))
        )
    }

    public static wrapPopulate<T>(doc: Document, populates: string[]): Observable<Document<T>> {
        const arr = [];
        populates.map(str => arr.push({path: str}));
        return from(doc.populate(arr).execPopulate());
    }

    public static wrapPopulates<T>(docs: Document[], populates: string[]): Observable<T[]> {
        const arr = [];
        populates.map(str => arr.push({path: str}));

        const arrWithObservers: Observable<Document<T>>[] = [];

        docs.map(doc => arrWithObservers.push(from(doc.populate(arr).execPopulate())));

        return (arrWithObservers.length) ? combineLatest(arrWithObservers) : of([]);
    }

    public static deleteByParams<T>(model: Model<T>, filter?: FilterQuery<T>, options?: QueryOptions): Observable<boolean> {
        return from(model.deleteMany(filter, options).exec()).pipe(
          map(result => (result.deletedCount >= 0))
        );
    }
}

export enum UsersProfilePopulateEnums {
    location = 'location',
    nationality = 'nationality',
    languages = 'languages'
}
