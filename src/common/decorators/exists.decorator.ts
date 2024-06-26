import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DataSource, EntityTarget, Equal } from 'typeorm';

interface ExistsProperties {
  entity: EntityTarget<any>;
  column: string;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const [constraints] = args.constraints;
    const { entity, column } = constraints as ExistsProperties;
    const repository = this.dataSource.getRepository(entity);
    const result = await repository.findOne({
      where: { [column]: Equal(value) },
    });

    return result != null;
  }

  defaultMessage(args: ValidationArguments): string {
    const [constraints] = args.constraints;
    const { entity } = constraints as ExistsProperties;
    const repository = this.dataSource.getRepository(entity);
    const tableName = repository.metadata.tableName;

    return `$property must exist in the ${tableName} table.`;
  }
}

export function Exists(
  property: ExistsProperties,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ExistsConstraint,
    });
  };
}
