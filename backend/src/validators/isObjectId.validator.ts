import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {Types} from "mongoose";

export function IsObjectId(property?: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: {...validationOptions, message: `mast be id`},
            constraints: [property],
            validator: IsObjectIdConstraint,
        });
    };
}

@ValidatorConstraint({name: 'IsObjectId', async: false})
export class IsObjectIdConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {

        try {
            const id = Types.ObjectId(value);
            return true;
        } catch (e) {
            return false;
        }
    }

}
