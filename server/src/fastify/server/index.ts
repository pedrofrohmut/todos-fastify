import Fastify, { FastifyInstance } from "fastify"
import fastifyEnv from "fastify-env"
import formbody from "fastify-formbody"
import FastifyRouterBuilder from "../router/implementations/fastify-router.builder"

import tasksRoutes from "../routes/tasks.routes"
import todosRoutes from "../routes/todos.routes"
import usersRoutes from "../routes/users.routes"

const server: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  logger: { prettyPrint: true }
})

/**
 * ENV Setup/validation
 */
const envSchema = {
  type: "object",
  required: ["PORT", "JWT_SECRET", "PGUSER", "PGHOST", "PGPASSWORD", "PGDATABASE", "PGPORT"],
  properties: {
    PORT: { type: "string", default: 5000 }
  }
}
server
  .register(fastifyEnv, {
    confKey: "config",
    dotenv: true,
    schema: envSchema,
    data: process.env
  })
  .ready(err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })

/**
 * MIDDLEWARES
 */
// Body Parser
server.register(formbody)

/**
 * ROUTER
 */
const defaultRouter = null
server.decorateRequest("router", defaultRouter)
server.addHook("onRequest", async (request, response) => {
  request.router = new FastifyRouterBuilder(
    request,
    response,
    process.env.JWT_SECRET!
  ).buildRouter()
})

/**
 * ROUTES
 */
server.register(tasksRoutes)
server.register(todosRoutes)
server.register(usersRoutes)

const start = async () => {
  try {
    await server.listen(5000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
