import { FastifyPluginCallback } from "fastify"
import ControllerUtilImplementation from "../../domain/controllers/controller.util"
import CreateTaskControllerImplementation from "../../domain/controllers/tasks/implementations/create-task.controller"
import { TaskBody } from "../../domain/types/controller/body.types"

import { checkBodyExists } from "../../domain/utils/routes/body.util"
import { checkHeadersForAuthentication } from "../../domain/utils/routes/headers.util"
import { checkParamsForTaskId, checkParamsForUserId } from "../../domain/utils/routes/params.util"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTaskRoute
  fastify.post("/api/tasks", async (request, response) => {
    const message = "Cannot find tasks by user id"
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    // response.status(201).send()
    const controllerExecutor = new ControllerUtilImplementation(request)
    const { status, body } = await controllerExecutor.workOn(CreateTaskControllerImplementation)
    response.status(status).send(body)
  })

  // DeleteTaskRoute
  fastify.delete("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot delete a task"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })

  // FindTaskByIdRoute
  fastify.get("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot find task by id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    const responseBody: TaskBody = {
      id: "id",
      name: "task_name",
      description: "task_description",
      userId: "userId"
    }
    response.status(200).send(responseBody)
  })

  // FindTasksByUserIdRoute
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    const message = "Cannot find tasks by user id"
    checkParamsForUserId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    const responseBody: TaskBody[] = [
      {
        id: "id",
        name: "task_name",
        description: "task_description",
        userId: "userId"
      },
      {
        id: "id",
        name: "task_name",
        description: "task_description",
        userId: "userId"
      },
      {
        id: "id",
        name: "task_name",
        description: "task_description",
        userId: "userId"
      }
    ]
    response.status(200).send(responseBody)
  })

  // UpdateTaskRoute
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot update task"
    checkParamsForTaskId(request, response, message)
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })
}

export default tasksRoutesPluginCallback
