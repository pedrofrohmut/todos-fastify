import { FastifyPluginCallback } from "fastify"

const routes: FastifyPluginCallback = async (fastify, _options) => {
  // Home
  fastify.get("/", async (__request, __response) => {
    return "Hello Routes"
  })
  /**
   * TASKS
   */
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

  /**
   * TODOS
   */
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

  /**
   * USERS
   */
  // CreateUser
  fastify.post("/api/users", async (_request, _response) => {
    return "Create User"
  })

  // GetSignedUser
  fastify.get("/api/users/signed", async (_request, _response) => {
    return "Get Signed User"
  })

  // SignInUser
  fastify.post("/api/users/signin", async (_request, _response) => {
    return "Sign In User"
  })
}

export default routes
