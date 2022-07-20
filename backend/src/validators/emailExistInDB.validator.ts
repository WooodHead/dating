import { registerDecorator, ValidationOptions } from 'class-validator';
import {EmailExistInDBRule} from "./emailExistInDB.rule";

export function EmailExistInDB(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'EmailExistInDB',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: EmailExistInDBRule,
        });
    };
}