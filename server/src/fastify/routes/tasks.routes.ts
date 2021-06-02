import { FastifyPluginCallback } from "fastify"

import callAdapterWith from "./functions/call-adapter-with.function"

import CreateTaskController from "../../domain/controllers/tasks/create-task.controller"
import DeleteTaskController from "../../domain/controllers/tasks/delete-task.controller"
import FindTaskByIdController from "../../domain/controllers/tasks/find-task-by-id.controller"
import FindTasksByUserIdController from "../../domain/controllers/tasks/find-tasks-by-user-id.controller"
import UpdateTaskController from "../../domain/controllers/tasks/update-task.controller"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTask
  fastify.post("/api/tasks/user/:userId", async (request, response) => {
    callAdapterWith(CreateTaskController, request, response)
  })

  // DeleteTask
  fastify.delete("/api/tasks/:taskId", async (request, response) => {
    callAdapterWith(DeleteTaskController, request, response)
  })

  // FindTaskById
  fastify.get("/api/tasks/:taskId", async (request, response) => {
    callAdapterWith(FindTaskByIdController, request, response)
  })

  // FindTasksByUserId
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    callAdapterWith(FindTasksByUserIdController, request, response)
  })

  // UpdateTask
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    callAdapterWith(UpdateTaskController, request, response)
  })
}

export default tasksRoutesPluginCallback
