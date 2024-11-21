import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsInYear(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isInYear',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedYear: number = (args.object as any)[relatedPropertyName];
                    let year: number;
                    try {
                        year = new Date(value).getFullYear();
                    } catch (err) {
                        return false;
                    }
                    if (year !== relatedYear) {
                        return false;
                    }
                    return true;
                },
            },
        });
    };
}