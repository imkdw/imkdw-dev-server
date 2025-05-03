import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsNullableString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNullableString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          return value === null || typeof value === 'string';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}는 문자열이거나 null일 수 있습니다`;
        },
      },
    });
  };
}
