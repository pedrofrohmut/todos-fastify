import Fastify, { FastifyInstance } from "fastify"
import fastifyEnv from "fastify-env"
import formbody from "fastify-formbody"

import tasksRoutes from "./routes/tasks.routes"
import todosRoutes from "./routes/todos.routes"
import usersRoutes from "./routes/users.routes"

const server: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  logger: { prettyPrint: true }
})

/**
 * MIDDLEWARES
 */
// Body Parser
server.register(formbody)

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
    }
    // @ts-ignore
    console.log(server.config)
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
