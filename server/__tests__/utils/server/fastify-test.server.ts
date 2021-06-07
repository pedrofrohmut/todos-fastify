import Fastify from "fastify"

import TasksRoutes from "../../../src/fastify/routes/tasks.routes"
import TodosRoutes from "../../../src/fastify/routes/todos.routes"
import UsersRoutes from "../../../src/fastify/routes/users.routes"

export const buildTestServerWithTasksRoutes = () => {
  const server = Fastify({ logger: false })
  server.register(TasksRoutes)
  return server
}

export const buildTestServerWithTodosRoutes = () => {
  const server = Fastify({ logger: false })
  server.register(TodosRoutes)
  return server
}

export const buildTestServerWithUsersRoutes = () => {
  const server = Fastify({ logger: false })
  server.register(UsersRoutes)
  return server
}
