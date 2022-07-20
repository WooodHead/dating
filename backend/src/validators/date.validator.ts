import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from "moment";

export function DateValidator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'dateValidator',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {...validationOptions, message: `incorrect date format`},
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) return false;
                    return !isNaN(value.getTime());
                },
            },
        });
    };
}