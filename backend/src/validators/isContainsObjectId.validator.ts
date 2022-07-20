import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {Types} from "mongoose";

export function IsContainsObjectId(property?: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: {...validationOptions, message: `mast be array of id`},
            constraints: [property],
            validator: IsContainsObjectIdConstraint,
        });
    };
}

@ValidatorConstraint({name: 'IsObjectId', async: false})
export class IsContainsObjectIdConstraint implements ValidatorConstraintInterface {

    validate(value: string[], args: ValidationArguments) {

        try {
            value.map(val => Types.ObjectId(val))
            return true;
        } catch (e) {
            return false;
        }
    }

}
