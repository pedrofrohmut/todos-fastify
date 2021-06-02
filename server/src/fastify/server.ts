import Fastify, { FastifyInstance } from "fastify"
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
