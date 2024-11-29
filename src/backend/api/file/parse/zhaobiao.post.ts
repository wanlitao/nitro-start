import { File_Request_Path, Zhaobiao_FileInfo } from "~/types";
import { NitroRouteMetaBuilder, OpenApiSchemaMapper } from "~/openapi";

defineRouteMeta(
  new NitroRouteMetaBuilder()
    .withDescription("解析招标文件")
    .withJsonRequestContent(
      OpenApiSchemaMapper.mapObjectSubtype()
        .withProperties<File_Request_Path>()
        .build()
    )
    .withSuccessJsonResponse(
      "招标文件信息",
      OpenApiSchemaMapper.mapObjectSubtype()
        .withProperties<Zhaobiao_FileInfo>()
        .build()
    )
    .build()
);

export default defineEventHandler(async (event) => {
  const body = await readBody<File_Request_Path>(event);
  if (body && body.filePath) {
    return <Zhaobiao_FileInfo>{
      fileVersionInfo: {
        tradeProjectId: "",
        tradeSectionId: "",
        version: "",
      },
      projectInfo: {
        tddProjectId: "",
        tradeProjectId: "",
        caEncryptionFlag: 0,
      },
      docFileInfos: [],
      docCompositionInfos: [],
      quotationListInfos: [],
    };
  }

  throw createError({
    statusCode: 400,
    message: "未传入文件路径参数",
  });
});
