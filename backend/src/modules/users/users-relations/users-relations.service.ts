import { Injectable } from '@nestjs/common';
import { combineLatest, from, map, Observable, of, tap } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types, UpdateWriteOpResult } from 'mongoose';
import { Relations, RelationsDocuments } from './schemas/relations.schema';
import { RelationsEnum } from './enums/relations.enum';

@Injectable()
export class UsersRelationsService {

    public constructor(
        @InjectModel(Relations.name) private readonly relationsModel: Model<RelationsDocuments>
    ) {
    }

    public changeRelation(owner: Types.ObjectId, target: Types.ObjectId, relation: RelationsEnum): Observable<RelationsDocuments | UpdateWriteOpResult> {
        return from(this.relationsModel.updateOne({owner, target}, {owner, target, relation}, {upsert: true}))
    }

    public usersIdsWhoBlockActiveUser(activeUserId: Types.ObjectId): Observable<Types.ObjectId[]> {
        return from(this.relationsModel.find({
            target: activeUserId,
            relation: RelationsEnum.block
        }, {owner: 1}).exec()).pipe(
            map(arr => arr.map(
                item => item.owner
            ))
        )
    }

    public blockActiveUser(activeUserId: Types.ObjectId): Observable<Types.ObjectId[]> {
        return from(this.relationsModel.find({
            owner: activeUserId,
            relation: RelationsEnum.block
        }, {target: 1}).exec()).pipe(
            map(arr => arr.map(
                item => item.target
            ))
        )
    }

    public getRelationsInfo(owner: Types.ObjectId, target: Types.ObjectId): Observable<string> {
        return from(this.relationsModel.findOne({owner, target}, {_id: 0, relation: 1})).pipe(
            map(document => (document) ? document.relation : RelationsEnum.default)
        );
    }

    public isBlocked(id1: Types.ObjectId, id2: Types.ObjectId): Observable<boolean> {
        const result1 = from(this.relationsModel.findOne({owner: id1, target: id2}))
        const result2 = from(this.relationsModel.findOne({owner: id2, target: id1}))
        return combineLatest([
            result1.pipe(map(result => (result?.relation == RelationsEnum.block))),
            result2.pipe(map(result => (result?.relation == RelationsEnum.block))),
        ]).pipe(map(data => (data[0] || data[1])));
    }

    public relationBothUsers(user1: Types.ObjectId, user2: Types.ObjectId): Observable<{ to: string, from: string }> {
        return combineLatest([
            this.getRelationsInfo(user1, user2),
            this.getRelationsInfo(user2, user1),
        ]).pipe(map(relations => {
            return {to: relations[0], from: relations[1]}
        }))
    }

    public listOfBlockUsers(userId: Types.ObjectId): Observable<Types.ObjectId[]> {
        return combineLatest({
            userBlock: this.blockActiveUser(userId),
            whoBlockUser: this.usersIdsWhoBlockActiveUser(userId),
        }).pipe(
            map((data: {userBlock: Types.ObjectId[], whoBlockUser: Types.ObjectId[]}) => data.userBlock.concat(data.whoBlockUser)),
            map(ids => ids.map(id => String(id))),
            map(ids => [...new Set(ids)]),
            map(ids => ids.map(id => Types.ObjectId(id)))
        )
    }
}
