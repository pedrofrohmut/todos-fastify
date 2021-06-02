import { FastifyPluginCallback } from "fastify"

/**
 * TASKS
 */
const tasksRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateTask
  fastify.post("/api/tasks/user/:userId", async (_request, _response) => {
    return "Create Task"
  })

  // DeleteTask
  fastify.delete("/api/tasks/:taskId", async (_request, _response) => {
    return "Delete Task"
  })

  // FindTaskById
  fastify.get("/api/tasks/:taskId", async (_request, _response) => {
    return "Find Task By Id"
  })

  // FindTasksByUserId
  fastify.get("/api/tasks/user/:userId", async (_request, _response) => {
    return "Find Tasks By User Id"
  })

  // UpdateTask
  fastify.put("/api/tasks/:taskId", async (_request, _response) => {
    return "Update Task"
  })
}

export default tasksRoutesPluginCallback
