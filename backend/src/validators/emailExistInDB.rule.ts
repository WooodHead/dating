import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Injectable} from "@nestjs/common";
import {UsersService} from "../modules/users/users.service";
import {lastValueFrom, map} from "rxjs";

@ValidatorConstraint({name: 'EmailExistInDBRule', async: true})
@Injectable()
export class EmailExistInDBRule implements ValidatorConstraintInterface {
    constructor(private usersRepository: UsersService) {
    }

    async validate(value: string) {
        try {
            const user = await lastValueFrom(this.usersRepository.findUserByParam({email: value}));
            return true;
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `Incorrect email`;
    }
}