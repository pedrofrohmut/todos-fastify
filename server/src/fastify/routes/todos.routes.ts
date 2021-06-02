import { FastifyPluginCallback } from "fastify"

/**
 * TODOS
 */
const todosRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // ClearCompleteTodosByTaskId
  fastify.delete("/api/todos/task/:taskId", async (_request, _response) => {
    return "Clear Complete Todos By Task Id"
  })

  // CreateTodo
  fastify.post("/api/todos", async (_request, _response) => {
    return "Create Todo"
  })

  // DeleteTodo
  fastify.delete("/api/todos/:todoId", async (_request, _response) => {
    return "Delete Todo"
  })

  // FindTodoById
  fastify.get("/api/todos/:todoId", async (_request, _response) => {
    return "Delete Todo"
  })

  // FindTodosByTaskId
  fastify.get("/api/todos/task/:taskId", async (_request, _response) => {
    return "Find Todos By Task Id"
  })

  // SetTodosAsDone
  fastify.patch("/api/todos/setdone/:todoId", async (_request, _response) => {
    return "Set Todo As Done"
  })

  // SetTodoAsNotDone
  fastify.patch("/api/todos/setnotdone/:todoId", async (_request, _response) => {
    return "Set Todo As Not Done"
  })

  // UpdateTodo
  fastify.put("/api/todos/:todoId", async (_request, _response) => {
    return "Update Todo"
  })
}

export default todosRoutesPluginCallback
