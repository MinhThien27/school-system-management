import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAfterDate(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isAfterDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    let comparedDate: Date;
                    if (typeof value !== 'string' || typeof relatedValue !== 'string') {
                        return false;
                    }
                    try {
                        value = new Date(value);
                        comparedDate = new Date(relatedValue);
                    } catch (err) {
                        return false;
                    }
                    if (value <= comparedDate) {
                        return false;
                    }
                    return true;
                },
            },
        });
    };
}