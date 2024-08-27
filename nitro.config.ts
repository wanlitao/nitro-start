//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "src/backend",
  output: {
    dir: "dist/backend",
  },  
  experimental: {
    openAPI: true,
    asyncContext: true,
  },
  compatibilityDate: "2024-08-27",
});
