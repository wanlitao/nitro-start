import {
  OpenApiIntegerSubtypeBuilder,
  OpenApiNumberSubtypeBuilder,
  OpenApiStringSubtypeBuilder,
  OpenApiBooleanSubtypeBuilder,
  OpenApiNullSubtypeBuilder,
  OpenApiObjectSubtypeBuilder,
  OpenApiArraySubtypeBuilder,
} from "./openapi-schema-builder";

export class OpenApiSchemaMapper {
  static mapStringSubtype() {
    return new OpenApiStringSubtypeBuilder();
  }

  static mapNumberSubtype() {
    return new OpenApiNumberSubtypeBuilder();
  }

  static mapIntegerSubtype() {
    return new OpenApiIntegerSubtypeBuilder();
  }

  static mapBooleanSubtype() {
    return new OpenApiBooleanSubtypeBuilder();
  }

  static mapNullSubtype() {
    return new OpenApiNullSubtypeBuilder();
  }

  static mapObjectSubtype() {
    return new OpenApiObjectSubtypeBuilder();
  }

  static mapArraySubtype() {
    return new OpenApiArraySubtypeBuilder();
  }
}
