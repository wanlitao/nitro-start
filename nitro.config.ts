//https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: '2024-08-07',
  srcDir: "src/backend",
  output: {
    dir: "dist/backend"
  },
  experimental: {
    openAPI: true,
    asyncContext: true
  }  
})
