import { FastifyPluginCallback } from "fastify"

import CreateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "../../domain/controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/update-task.controller"

import ControllerUtil from "../../utils/controllers/controller.util"
import { checkBodyExists } from "../../utils/routes/body.util"
import { checkHeadersForAuthentication } from "../../utils/routes/headers.util"
import { checkParamsForTaskId, checkParamsForUserId } from "../../utils/routes/params.util"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTaskRoute
  fastify.post("/api/tasks", async (request, response) => {
    const message = "Cannot create task"
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(CreateTaskControllerImplementation)
  })

  // DeleteTaskRoute
  fastify.delete("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot delete task"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(DeleteTaskControllerImplementation)
  })

  // FindTaskByIdRoute
  fastify.get("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot find task by id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(FindTaskByIdControllerImplementation)
  })

  // FindTasksByUserIdRoute
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    const message = "Cannot find tasks by user id"
    checkParamsForUserId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(FindTasksByUserIdControllerImplementation)
  })

  // UpdateTaskRoute
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot update task"
    checkParamsForTaskId(request, response, message)
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(UpdateTaskControllerImplementation)
  })
}

export default tasksRoutesPluginCallback
