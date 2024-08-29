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
