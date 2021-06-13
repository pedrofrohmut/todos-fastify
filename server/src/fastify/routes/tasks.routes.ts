import { FastifyPluginCallback } from "fastify"

import CreateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "../../domain/controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/update-task.controller"

import FastifyRouterBuilder from "../router/implementations/fastify-router.builder"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTaskRoute
  fastify.post("/api/tasks", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(CreateTaskControllerImplementation)
  })

  // DeleteTaskRoute
  fastify.delete("/api/tasks/:taskId", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(DeleteTaskControllerImplementation)
  })

  // FindTaskByIdRoute
  fastify.get("/api/tasks/:taskId", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(FindTaskByIdControllerImplementation)
  })

  // FindTasksByUserIdRoute
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(FindTasksByUserIdControllerImplementation)
  })

  // UpdateTaskRoute
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(UpdateTaskControllerImplementation)
  })
}

export default tasksRoutesPluginCallback
