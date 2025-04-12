import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNullableString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNullableString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value === null || typeof value === 'string';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be either null or a string`;
        },
      },
    });
  };
}
