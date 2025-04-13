import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          return typeof value === 'string' && value.trim() !== '';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a non-empty string`;
        },
      },
    });
  };
}
