import { registerDecorator, ValidationOptions } from 'class-validator';
import {EmailNotExistInDBRule} from "./emailNotExistInDB.rule";


export function EmailNotExistInDB(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'EmailNotExistInDB',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: EmailNotExistInDBRule,
        });
    };
}
