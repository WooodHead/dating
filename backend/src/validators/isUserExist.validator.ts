import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {UsersService} from "../modules/users/users.service";
import {lastValueFrom, map} from "rxjs";
import {ObjectId} from "mongoose";

export function isUserExist(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: {...validationOptions, message: `User dosen\'t found`},
            constraints: [],
            validator: isUserExistConstraint,
        });
    };
}

@ValidatorConstraint({name: 'isUserExist'})
export class isUserExistConstraint implements ValidatorConstraintInterface {

    constructor(private usersRepository: UsersService) {}

    public async validate(value: ObjectId, args: ValidationArguments) {
        return await lastValueFrom(this.usersRepository.findUserByParam({_id: value}).pipe(map(user => !!(user))));
    }

}
