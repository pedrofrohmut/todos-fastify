import Fastify from "fastify"

import TasksRoutes from "../../../src/fastify/routes/tasks.routes"
import TodosRoutes from "../../../src/fastify/routes/todos.routes"
import UsersRoutes from "../../../src/fastify/routes/users.routes"

export const buildTestServerWithAllRoutes = () => {
  const server = Fastify({ logger: false })
  server.register(TasksRoutes)
  server.register(TodosRoutes)
  server.register(UsersRoutes)
  return server
}
