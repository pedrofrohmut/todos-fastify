import Fastify, { FastifyInstance } from "fastify"
import formbody from "fastify-formbody"

import routes from "./routes"

const server: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  logger: { prettyPrint: true }
})

server.register(formbody)

server.register(routes)

const start = async () => {
  try {
    await server.listen(5000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
