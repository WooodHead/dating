import * as request from 'supertest';
import {
    incorrectLoginDto,
    incorrectRegistrationDto,
    loginWithNotExistUserDto,
    successLoginDto,
    successRegistrationDto
} from './dto';
import { Observable, switchMap, tap } from 'rxjs';
import { E2eTest } from '../IE2e.test';

export class AuthE2e extends E2eTest {

    protected testsDescription = 'Auth'

    private token: string;

    protected tests = [
        {
            name: 'success user registration',
            fn: this.successRegistration()
        },{
            name: 'register user with bad date',
            fn: this.registrationWithError()
        },{
            name: 'register with exist user',
            fn: this.registrationWithExistUser()
        },{
            name: 'authenticates user with valid credentials and provides a jwt token',
            fn: this.login()
        },{
            name: 'fails to authenticate user with an incorrect password',
            fn: this.loginFall()
        },{
            name: 'fails to authenticate user that does not exist',
            fn: this.loginFallUserDosentExist()
        }
    ]

    public successRegistration(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                .post('/auth/registration')
                .send(successRegistrationDto)
                .expect(201)
            )
        )
    }

    public registrationWithExistUser(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                .post('/auth/registration')
                .send(successRegistrationDto)
                .expect(400)
            )
        )
    }

    public registrationWithError(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                .post('/auth/registration')
                .send(incorrectRegistrationDto)
                .expect(400)
            ),
            tap(response => expect(response.body.message).toEqual(['incorrect date format'])),
            tap(response => this.token = response.body.token)
        )
    }

    public login(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                    .post('/auth/login')
                    .send(successLoginDto)
                    .expect(201)
            ),
            tap(response => expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)),
        )
    }

    public loginFall(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                    .post('/auth/login')
                    .send(incorrectLoginDto)
                    .expect(400)
            )
        )
    }

    public loginFallUserDosentExist(): Observable<any> {
        return this.data$.pipe(
            switchMap(data => request(data.httpServer)
                    .post('/auth/login')
                    .send(loginWithNotExistUserDto)
                    .expect(400)
            )
        )
    }

}
