export default defineNitroPlugin((nitroApp) => {
  const listenHost = process.env.HOST || "localhost"
  const listenPort = process.env.PORT || 3000  

  process.env.NITRO_LISTEN_URL = `http://${listenHost}:${listenPort}/`
})
