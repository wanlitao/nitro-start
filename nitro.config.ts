import { Nitro, RollupConfig } from "nitropack/types";
import { handlersOpenApiMeta } from "./src/nitro-extensions/rollup/plugins/handlers-openapi-meta";
import type { Plugin } from "rollup";

//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "src/backend",
  output: {
    dir: "dist/backend",
  },
  experimental: {
    openAPI: true,
    database: true,
    asyncContext: true,
  },
  openAPI: {
    production: "runtime",
    meta: {
      title: "nitro-sample",
      description: "nitro sample backend api",
      version: "1.0",
    },
  },
  database: {
    default: {
      connector: "sqlite",
      options: {
        name: "testdb",
      },
    },
  },
  hooks: {
    "rollup:before": (nitro: Nitro, config: RollupConfig) => {
      const rollupPlugins = config.plugins as Plugin[];

      const handlersMetaIndex = rollupPlugins.findIndex(
        (item) => item.name == "nitro:handlers-meta"
      );
      if (handlersMetaIndex !== -1) {
        rollupPlugins.splice(handlersMetaIndex, 1); //移除 handlers-meta插件
      }

      rollupPlugins.push(handlersOpenApiMeta());

      console.log(
        "nitro rollup plugins",
        rollupPlugins.map((p) => p.name)
      );
    },
  },
  compatibilityDate: "2024-08-27",
});
