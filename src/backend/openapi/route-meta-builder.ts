import { NitroRouteMeta } from "nitropack/types";
import {
  MediaTypeObject,
  OperationObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
} from "openapi-typescript";

export class NitroRouteMetaBuilder {
  private routeMetaInfo: OperationObject;
  private requestBody: RequestBodyObject;
  private responses: ResponsesObject;

  constructor() {
    this.routeMetaInfo = {};

    this.requestBody = { content: {} };

    this.responses = {};
  }

  withDescription(description: string) {
    this.routeMetaInfo.description = description;
    return this;
  }

  withRequestDescription(description: string, required?: boolean) {
    const mergeRequestBody = <RequestBodyObject>{
      ...this.requestBody,
      description,
      required,
    };

    this.requestBody = mergeRequestBody;

    return this;
  }

  withRequestContent(contentType: string, schema: SchemaObject) {
    const mergeContent = {
      ...this.requestBody.content,
      [contentType]: <MediaTypeObject>{
        schema,
      },
    };

    this.requestBody.content = mergeContent;

    return this;
  }

  withJsonRequestContent(schema: SchemaObject) {
    return this.withRequestContent("application/json", schema);
  }

  withResponseDescription(responseCode: string, description: string) {
    const mergeResponse = <ResponseObject>{
      ...(this.responses[responseCode] ?? {}),
      description,
    };

    this.responses[responseCode] = mergeResponse;

    return this;
  }

  withResponseContent(
    responseCode: string,
    contentType: string,
    schema: SchemaObject
  ) {
    const targetResponse = (this.responses[responseCode] ??
      {}) as ResponseObject;

    const mergeContent = {
      ...(targetResponse.content ?? {}),
      [contentType]: <MediaTypeObject>{
        schema,
      },
    };
    targetResponse.content = mergeContent;

    this.responses[responseCode] = targetResponse;

    return this;
  }

  withJsonResponseContent(responseCode: string, schema: SchemaObject) {
    return this.withResponseContent(responseCode, "application/json", schema);
  }

  withSuccessResponseDescription(description: string) {
    return this.withResponseDescription("200", description);
  }

  withSuccessJsonResponseContent(schema: SchemaObject) {
    return this.withJsonResponseContent("200", schema);
  }

  withSuccessJsonResponse(description: string, schema: SchemaObject) {
    return this.withSuccessResponseDescription(description)
      .withSuccessJsonResponseContent(schema);
  }

  build() {
    this.routeMetaInfo = {
      ...this.routeMetaInfo,
      requestBody: this.requestBody,
      responses: this.responses,
    };

    return <NitroRouteMeta>{
      openAPI: this.routeMetaInfo,
    };
  }
}
