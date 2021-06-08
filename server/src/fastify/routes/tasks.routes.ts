import { FastifyPluginCallback } from "fastify"

import CreateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "../../domain/controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../../domain/controllers/tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/update-task.controller"

import ControllerUtilImplementation from "../../domain/controllers/controller.util"
import { checkBodyExists } from "../../domain/utils/routes/body.util"
import { checkHeadersForAuthentication } from "../../domain/utils/routes/headers.util"
import { checkParamsForTaskId, checkParamsForUserId } from "../../domain/utils/routes/params.util"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTaskRoute
  fastify.post("/api/tasks", async (request, response) => {
    const message = "Cannot create task"
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    ControllerUtilImplementation.callControllerUtilsWith(
      request,
      response,
      CreateTaskControllerImplementation
    )
  })

  // DeleteTaskRoute
  fastify.delete("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot delete task"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    ControllerUtilImplementation.callControllerUtilsWith(
      request,
      response,
      DeleteTaskControllerImplementation
    )
  })

  // FindTaskByIdRoute
  fastify.get("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot find task by id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    ControllerUtilImplementation.callControllerUtilsWith(
      request,
      response,
      FindTaskByIdControllerImplementation
    )
  })

  // FindTasksByUserIdRoute
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    const message = "Cannot find tasks by user id"
    checkParamsForUserId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    ControllerUtilImplementation.callControllerUtilsWith(
      request,
      response,
      FindTasksByUserIdControllerImplementation
    )
  })

  // UpdateTaskRoute
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot update task"
    checkParamsForTaskId(request, response, message)
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    ControllerUtilImplementation.callControllerUtilsWith(
      request,
      response,
      UpdateTaskControllerImplementation
    )
  })
}

export default tasksRoutesPluginCallback
