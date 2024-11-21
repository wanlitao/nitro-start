import { NitroOpenAPIConfig } from "nitropack/types";

const buildApiIndexHtml = (openApiConfig: NitroOpenAPIConfig) => {
  const indexHtmlSegments = [];

  const openApiMeta = openApiConfig?.meta;
  if (openApiMeta) {
    indexHtmlSegments.push(openApiMeta.description ?? openApiMeta.title);
  }

  if (process.env.NITRO_LISTEN_URL) {
    indexHtmlSegments.push(`Listening on ${process.env.NITRO_LISTEN_URL}`);
  }

  if (process.env.NITRO_SWAGGER_URL) {
    indexHtmlSegments.push(
      `Swagger UI at <a target="_blank" href="${process.env.NITRO_SWAGGER_URL}">${process.env.NITRO_SWAGGER_URL}</a>`
    );
  }

  return indexHtmlSegments.join("<br/>");
};

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);

  return buildApiIndexHtml(runtimeConfig.nitro.openAPI);
});
