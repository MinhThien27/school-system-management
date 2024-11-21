import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidVNPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidVNPhomeNumber',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'number' && typeof value !== 'string') return false;
                    value = value.toString();
                    if (!value.startsWith('0')) return false;
                    if (value.length !== 10) return false;
                    return true;
                },
            },
        });
    };
}