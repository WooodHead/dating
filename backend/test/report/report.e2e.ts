import * as request from 'supertest';
import {
    combineLatest,
    concatMap,
    from,
    last, map,
    mergeMap,
    Observable,
    of,
    shareReplay,
    switchMap,
    take,
    tap
} from 'rxjs';
import { repeat, delay } from 'rxjs/operators';
import { E2eTest } from '../IE2e.test';
import { RegistrationResponse } from '../../src/modules/auth/auth.type';
import { UserFactory, UsersWithSharedAlbum } from '../test.factory';
import { first } from 'rxjs/operators';
import { RelationsEnum } from '../../src/modules/users/users-relations/enums/relations.enum';

export class ReportE2e extends E2eTest {

    protected testsDescription = 'Report'

    private usersWithSharedAlbum$: Observable<UsersWithSharedAlbum> = of(new UserFactory(this.data$)).pipe(
        switchMap(factory => factory.createUsersWithSharedAlbums()),
        first(),
        shareReplay(1)
    )

    private user$: Observable<RegistrationResponse & {token: string}> = of(new UserFactory(this.data$)).pipe(
        switchMap(factory => factory.createUser()),
        first(),
    )

    protected tests = [
        {
            name: 'test relation with block user',
            fn: this.testBlockAndRelationAfterReport()
        }, {
            name: 'check access to system by bloc user',
            fn: this.testBlockUserAccess()
        },
    ]

    public testBlockAndRelationAfterReport(): Observable<any> {
        return combineLatest({
            data: this.data$,
            usersWithPermission: this.usersWithSharedAlbum$
        }).pipe(concatMap(result =>
                from(request(result.data.httpServer)
                    .post('/users-relations/change-relation')
                    .send({targetUserId: result.usersWithPermission.secondUser.profile.user, relation: RelationsEnum.block})
                    .set('Authorization', `Bearer ${result.usersWithPermission.usersWithAlbums.user.token}`)
                    .expect(200)
                ).pipe(
                    concatMap(() => request(result.data.httpServer)
                        .get(`/user-profile/user/${result.usersWithPermission.usersWithAlbums.user.profile.user}`)
                        .set('Authorization', `Bearer ${result.usersWithPermission.secondUser.token}`)
                        .expect(200)),
                    tap(response => expect(response.body.relations.from).toEqual(RelationsEnum.block)),
                    //TODO: check photo access with block user

                    // concatMap(() => request(result.data.httpServer)
                    //     .get(`/user-profile/user/${result.usersWithPermission.usersWithAlbums.user.profile.user}`)
                    //     .set('Authorization', `Bearer ${result.usersWithPermission.secondUser.token}`)
                    //     .expect(200)),
                    // tap(response => expect(response.body.relations.from).toEqual(RelationsEnum.block)),
                )
            )
        )
    }

    public testBlockUserAccess(): Observable<any> {
        return combineLatest({
            blockUser: this.user$,
            data: this.data$,

        }).pipe(
            concatMap(data => this.user$.pipe(
                map(user => ({...data, activeUser: user})),
                delay(200),
                repeat(5)
            )),
            mergeMap(data => from(request(data.data.httpServer)
                .post('/report')
                .send({targetUserId: data.blockUser.profile.user, reason: 'reasonText'})
                .set('Authorization', `Bearer ${data.activeUser.token}`)
                .expect(200)
            ).pipe(delay(200), map(() => data))),
            take(5),
            last(),
            concatMap(data => from(request(data.data.httpServer)
                .post('/auth/login')
                .send({
                    email: data.blockUser.user.email,
                    password: 'admin12345',
                })
                .expect(403)
            ))
        )
    }
}

