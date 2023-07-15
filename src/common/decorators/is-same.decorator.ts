import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint()
export class IsSameConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (value === relatedValue) {
      return true;
    }

    return false;
  }

  defaultMessage(): string {
    return 'The $property must be the same as $constraint1';
  }
}

export function IsSame(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsSameConstraint,
    });
  };
}
