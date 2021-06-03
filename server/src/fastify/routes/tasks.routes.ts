import { FastifyPluginCallback } from "fastify"

import callAdapterWith from "./functions/call-adapter-with.function"

import CreateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "../../domain/controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/update-task.controller"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTask
  fastify.post("/api/tasks/user/:userId", async (request, response) => {
    callAdapterWith(CreateTaskControllerImplementation, request, response)
  })

  // DeleteTask
  fastify.delete("/api/tasks/:taskId", async (request, response) => {
    callAdapterWith(DeleteTaskControllerImplementation, request, response)
  })

  // FindTaskById
  fastify.get("/api/tasks/:taskId", async (request, response) => {
    callAdapterWith(FindTaskByIdControllerImplementation, request, response)
  })

  // FindTasksByUserId
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    callAdapterWith(FindTasksByUserIdControllerImplementation, request, response)
  })

  // UpdateTask
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    callAdapterWith(UpdateTaskControllerImplementation, request, response)
  })
}

export default tasksRoutesPluginCallback
