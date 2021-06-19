import { FastifyPluginCallback } from "fastify"

import CreateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "../../domain/controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/update-task.controller"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTaskRoute
  fastify.post("/api/tasks", async (request, _response) => {
    // const router = new FastifyRouterBuilder(request, _response, process.env.JWT_SECRET!).buildRouter()
    // await router.routeController(CreateTaskControllerImplementation)
    await request.router.routeController(CreateTaskControllerImplementation)
  })

  // DeleteTaskRoute
  fastify.delete("/api/tasks/:taskId", async (request, _response) => {
    request.router.routeController(DeleteTaskControllerImplementation)
  })

  // FindTaskByIdRoute
  fastify.get("/api/tasks/:taskId", async (request, _response) => {
    request.router.routeController(FindTaskByIdControllerImplementation)
  })

  // FindTasksByUserIdRoute
  fastify.get("/api/tasks/user/:userId", async (request, _response) => {
    request.router.routeController(FindTasksByUserIdControllerImplementation)
  })

  // UpdateTaskRoute
  fastify.put("/api/tasks/:taskId", async (request, _response) => {
    request.router.routeController(UpdateTaskControllerImplementation)
  })
}

export default tasksRoutesPluginCallback
