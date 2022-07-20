import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { combineLatest, lastValueFrom, map, of } from 'rxjs';
import { UsersService } from '../modules/users/users.service';
import { AuthService } from '../modules/auth/auth.service';
import { catchError } from 'rxjs/operators';

@ValidatorConstraint({name: 'EmailNotExistInDBRule', async: true})
@Injectable()
export class EmailNotExistInDBRule implements ValidatorConstraintInterface {
    constructor(
        private readonly usersRepository: UsersService,
        private readonly authService: AuthService,
    ) {}

    async validate(value: string) {
        return  await lastValueFrom(
            combineLatest({
                user: this.usersRepository.findUserByParam({email: value}).pipe(
                    map(() => false),
                    catchError(() => of(true))
                ),
                rowUser: this.authService.getRegistrationData({email: value}).pipe(
                    map(() => false),
                    catchError(() => of(true))
                )
            }).pipe(
                map(result => (result.user && result.rowUser))
            )
        );
    }

    defaultMessage(args: ValidationArguments) {
        return `This email already exist`;
    }
}
