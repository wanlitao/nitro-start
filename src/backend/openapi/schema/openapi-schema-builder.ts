import {
  ArraySubtype,
  BooleanSubtype,
  IntegerSubtype,
  NullSubtype,
  NumberSubtype,
  ObjectSubtype,
  SchemaObject,
  StringSubtype,
} from "openapi-typescript";

export interface OpenApiSchemaBuilder {
  build(): SchemaObject;
}

export class OpenApiStringSubtypeBuilder implements OpenApiSchemaBuilder {
  private enumValues: string[];

  constructor() {
    this.enumValues = [];
  }

  withEnums(enumValues: string[]) {
    this.enumValues.push(...enumValues);

    return this;
  }

  build() {
    const stringSubtype = <StringSubtype>{
      type: "string",
    };

    if (this.enumValues.length > 0) stringSubtype.enum = this.enumValues;

    return <SchemaObject>{
      ...stringSubtype,
    };
  }
}

export class OpenApiNumberSubtypeBuilder implements OpenApiSchemaBuilder {
  protected minimum?: number;
  protected maximum?: number;
  protected enumValues: number[];

  constructor() {
    this.enumValues = [];
  }

  withMinimum(minimum: number) {
    this.minimum = minimum;

    return this;
  }

  withMaximum(maximum: number) {
    this.maximum = maximum;

    return this;
  }

  withEnums(enumValues: number[]) {
    this.enumValues.push(...enumValues);

    return this;
  }

  build() {
    const numberSubtype = <NumberSubtype>{
      type: "number",
      minimum: this.minimum,
      maximum: this.maximum,
    };

    if (this.enumValues.length > 0) numberSubtype.enum = this.enumValues;

    return <SchemaObject>{
      ...numberSubtype,
    };
  }
}

export class OpenApiIntegerSubtypeBuilder extends OpenApiNumberSubtypeBuilder {
  override build() {
    const integerSubtype = <IntegerSubtype>{
      type: "integer",
      minimum: this.minimum,
      maximum: this.maximum,
    };

    if (this.enumValues.length > 0) integerSubtype.enum = this.enumValues;

    return <SchemaObject>{
      ...integerSubtype,
    };
  }
}

export class OpenApiBooleanSubtypeBuilder implements OpenApiSchemaBuilder {
  private enumValues: boolean[];

  constructor() {
    this.enumValues = [];
  }

  withEnums(enumValues: boolean[]) {
    this.enumValues.push(...enumValues);

    return this;
  }

  build() {
    const booleanSubtype = <BooleanSubtype>{
      type: "boolean",
    };

    if (this.enumValues.length > 0) booleanSubtype.enum = this.enumValues;

    return <SchemaObject>{
      ...booleanSubtype,
    };
  }
}

export class OpenApiNullSubtypeBuilder implements OpenApiSchemaBuilder {
  build() {
    const nullSubtype = <NullSubtype>{
      type: "null",
    };

    return <SchemaObject>{
      ...nullSubtype,
    };
  }
}

type PropertyInfo<T> = {
  [K in keyof T]: {
      propertyName: K;
      propertyType: T[K];
      isNullable: T[K] extends null | undefined ? true : false;
  };
};

export class OpenApiObjectSubtypeBuilder implements OpenApiSchemaBuilder {
  private properties: Record<string, SchemaObject>;
  private required: string[];

  constructor() {
    this.properties = {};
    this.required = [];
  }

  withProperty(name: string, schema: SchemaObject, required?: boolean) {
    this.properties[name] = schema;

    if (required) this.required.push(name);

    return this;
  }

  withProperties<T>() {
    const properties: PropertyInfo<T> = {} as PropertyInfo<T>;

    for (const key in properties) {
      const propertySchema = new OpenApiStringSubtypeBuilder().build();

      this.withProperty(properties[key].propertyName, propertySchema, !properties[key].isNullable);
    }

    return this;
  }  

  build() {
    const objectSubtype = <ObjectSubtype>{
      type: "object",
      properties: this.properties,
      required: this.required,
    };

    return <SchemaObject>{
      ...objectSubtype,
    };
  }
}

export class OpenApiArraySubtypeBuilder implements OpenApiSchemaBuilder {
  private item?: SchemaObject;
  private minItems?: number;
  private maxItems?: number;
  private enumValues: SchemaObject[];

  constructor() {
    this.enumValues = [];
  }

  withItem(item: SchemaObject) {
    this.item = item;

    return this;
  }

  withMinItems(minItems: number) {
    this.minItems = minItems;

    return this;
  }

  withMaxItems(maxItems: number) {
    this.maxItems = maxItems;

    return this;
  }

  withEnums(enumValues: SchemaObject[]) {
    this.enumValues.push(...enumValues);

    return this;
  }

  build() {
    const arraySubtype = <ArraySubtype>{
      type: "array",
      items: this.item,
      minItems: this.minItems,
      maxItems: this.maxItems,
    };

    if (this.enumValues.length > 0) arraySubtype.enum = this.enumValues;

    return <SchemaObject>{
      ...arraySubtype,
    };
  }
}
