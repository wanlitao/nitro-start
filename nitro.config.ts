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
    }
  },
  database: {
    default:{
      connector: "sqlite",
      options: {
        name: "testdb",
      }
    }
  },
  compatibilityDate: "2024-08-27",
});
