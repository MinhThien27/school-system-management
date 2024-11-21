import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidVNCitizenIdentification(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidVNCitizenIdentification',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'number' && typeof value !== 'string') return false;
                    value = value.toString();
                    if (value.length !== 12) return false;
                    return true;
                },
            },
        });
    };
}