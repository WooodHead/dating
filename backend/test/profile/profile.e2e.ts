import * as request from 'supertest';
import { combineLatest, concatMap, from, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { E2eTest } from '../IE2e.test';
import { RegistrationResponse } from '../../src/modules/auth/auth.type';
import { UserFactory } from '../test.factory';
import { first } from 'rxjs/operators';
import { LikeTypeEnum } from '../../src/modules/like/like.enum';

export class ProfileE2e extends E2eTest {

    protected testsDescription = 'Profile'

    private user$: Observable<RegistrationResponse & {token: string}> = of(new UserFactory(this.data$)).pipe(
        switchMap(factory => factory.createUser()),
        first(),
        shareReplay(1)
    )

    private otherUser$: Observable<RegistrationResponse & {token: string}> = of(new UserFactory(this.data$)).pipe(
        switchMap(factory => factory.createUser()),
        first(),
        shareReplay(1)
    )

    protected tests = [
        {
            name: 'gets user profile resource without jwt authenticated request',
            fn: this.userProfileWithoutJWT()
        },
        {
            name: 'gets user profile resource with jwt authenticated request',
            fn: this.userProfileWithJWT()
        },
        {
            name: 'gets other user profile resource with jwt authenticated request',
            fn: this.getOtherUserProfile()
        },
        {
            name: 'update user profile',
            fn: this.updateUserProfile()
        },

        {
            name: 'put like to user profile',
            fn: this.putLikeToUserProfile()
        },
        {
            name: 'search users',
            fn: this.searchUserProfile()
        },
    ]

    public userProfileWithoutJWT(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                .get('/user-profile')
                .expect(401)
            ),
        )
    }

    public userProfileWithJWT(): Observable<any> {
        return combineLatest({
            httpServer: this.data$.pipe(map(data => data.httpServer)),
            user: this.user$
        }).pipe(
            switchMap(data => from(request(data.httpServer)
                .get('/user-profile')
                .set('Authorization', `Bearer ${data.user.token}`)
                .expect(200)
            ).pipe(
                tap(response => expect(response.body.email).toBeDefined()),
                tap(response => expect(response.body.email).toEqual(data.user.user.email)),
            )),
        )
    }

    public getOtherUserProfile(): Observable<any> {
        return combineLatest({
            httpServer: this.data$.pipe(map(data => data.httpServer)),
            user: this.user$,
            otherUser: this.otherUser$
        }).pipe(
            switchMap(data => from(request(data.httpServer)
                .get(`/user-profile/user/${data.otherUser.profile.user}`)
                .set('Authorization', `Bearer ${data.user.token}`)
                .expect(200)
            ).pipe(
                tap(response => expect(response.body.likes).toBeDefined()),
                tap(response => expect(response.body.relations).toBeDefined()),
                tap(response => expect(response.body.chatLink).toBeDefined()),
                tap(response => expect(response.body.profile.user).toEqual(String(data.otherUser.profile.user))),
            )),
        )
    }

    public updateUserProfile(): Observable<any> {
        const updatesParams = UserFactory.generateUserProfileUpdateData();
        return combineLatest({
            httpServer: this.data$.pipe(map(data => data.httpServer)),
            user: this.user$
        }).pipe(
            switchMap(data => from(request(data.httpServer)
                .patch(`/user-profile`)
                .send(updatesParams)
                .set('Authorization', `Bearer ${data.user.token}`)
                .expect(200)
            ).pipe(
                switchMap(() => request(data.httpServer)
                    .get(`/user-profile`)
                    .set('Authorization', `Bearer ${data.user.token}`)
                    .expect(200)),
                tap(response => expect(response.body.profile.eyes).toEqual(updatesParams.eyes)),
                tap(response => expect(response.body.profile.professional).toEqual(updatesParams.professional)),
                tap(response => expect(response.body.profile.hair).toEqual(updatesParams.hair)),
                tap(response => expect(response.body.profile.status).toEqual(updatesParams.status)),
                tap(response => expect(response.body.profile.name).toEqual(updatesParams.name)),
            )),
        )
    }

    public searchUserProfile(): Observable<any> {
        return combineLatest({
            httpServer: this.data$.pipe(map(data => data.httpServer)),
            user: this.user$
        }).pipe(
            switchMap(data => from(
                request(data.httpServer)
                    .get(`/search`)
                    .query({gender: data.user.profile.gender})
                    .expect(200)
            ).pipe(
                tap(response => expect(response.body[0].gender).toEqual(data.user.profile.gender)),
            )),
        )
    }

    public putLikeToUserProfile(): Observable<any> {
        return combineLatest({
            httpServer: this.data$.pipe(map(data => data.httpServer)),
            user: this.user$,
            otherUser: this.otherUser$
        }).pipe(
            concatMap(data => from(request(data.httpServer)
                    .post(`/user-profile/like/${data.otherUser.profile.user}`)
                    .send({likeType: LikeTypeEnum.like})
                    .set('Authorization', `Bearer ${data.user.token}`)
                    .expect(200)
                ).pipe(
                    concatMap(() => from(
                        request(data.httpServer)
                            .post(`/user-profile/like/${data.otherUser.profile.user}`)
                            .send({likeType: LikeTypeEnum.heart})
                            .set('Authorization', `Bearer ${data.user.token}`)
                            .expect(200)
                    )),
                    concatMap(() => request(data.httpServer)
                        .get(`/user-profile/user/${data.otherUser.profile.user}`)
                        .set('Authorization', `Bearer ${data.user.token}`)
                        .expect(200)),
                    tap(response => expect(response.body.likes.like).toEqual(1)),
                    tap(response => expect(response.body.likes.heart).toEqual(1)),
                    tap(response => expect(response.body.likes.isUserPutLike).toEqual(true)),
                    tap(response => expect(response.body.likes.isUserPutHeart).toEqual(true)),
                ),
            )
        )
    }
}

