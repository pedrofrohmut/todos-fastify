import { FastifyPluginCallback } from "fastify"

import { checkBodyExists } from "./utils/body.util"
import { checkHeadersForAuthentication } from "./utils/headers.util"
import { checkParamsForTaskId, checkParamsForUserId } from "./utils/params.util"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTaskRoute
  fastify.post("/api/tasks", async (request, response) => {
    const message = "Cannot find tasks by user id"
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(201).send()
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
    response.status(200).send()
  })

  // FindTasksByUserIdRoute
  fastify.get("/api/tasks/user/:userId", async (request, response) => {
    const message = "Cannot find tasks by user id"
    checkParamsForUserId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(200).send()
  })

  // UpdateTaskRoute
  fastify.put("/api/tasks/:taskId", async (request, response) => {
    const message = "Cannot update task"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })
}

export default tasksRoutesPluginCallback
