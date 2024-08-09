//https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: '2024-08-07',
  srcDir: "server",
  experimental: {
    openAPI: true,
    asyncContext: true
  }  
})
