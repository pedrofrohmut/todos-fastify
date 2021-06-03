import { FastifyPluginCallback } from "fastify"

import callAdapterWith from "./functions/call-adapter-with.function"

import ClearCompleteTodosByTaskIdController from "../../domain/controllers/todos/implementations/clear-complete-todos-by-task-id.controller"
import CreateTodoController from "../../domain/controllers/todos/implementations/create-todo.controller"
import DeleteTodoController from "../../domain/controllers/todos/implementations/delete-todo.controller"
import FindTodoByIdController from "../../domain/controllers/todos/implementations/find-todo-by-id.controller"
import FindTodosByTaskIdController from "../../domain/controllers/todos/implementations/find-todos-by-task-id.controller"
import SetTodoAsDoneController from "../../domain/controllers/todos/implementations/set-todo-as-done.controller"
import SetTodoAsNotDoneController from "../../domain/controllers/todos/implementations/set-todo-as-not-done.controller"
import UpdateTodoController from "../../domain/controllers/todos/implementations/update-todo.controller"

/**
 * TODOS
 */
const todosRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // ClearCompleteTodosByTaskId
  fastify.delete("/api/todos/task/:taskId", async (request, response) => {
    callAdapterWith(ClearCompleteTodosByTaskIdController, request, response)
  })

  // CreateTodo
  fastify.post("/api/todos", async (request, response) => {
    callAdapterWith(CreateTodoController, request, response)
  })

  // DeleteTodo
  fastify.delete("/api/todos/:todoId", async (request, response) => {
    callAdapterWith(DeleteTodoController, request, response)
  })

  // FindTodoById
  fastify.get("/api/todos/:todoId", async (request, response) => {
    callAdapterWith(FindTodoByIdController, request, response)
  })

  // FindTodosByTaskId
  fastify.get("/api/todos/task/:taskId", async (request, response) => {
    callAdapterWith(FindTodosByTaskIdController, request, response)
  })

  // SetTodosAsDone
  fastify.patch("/api/todos/setdone/:todoId", async (request, response) => {
    callAdapterWith(SetTodoAsDoneController, request, response)
  })

  // SetTodoAsNotDone
  fastify.patch("/api/todos/setnotdone/:todoId", async (request, response) => {
    callAdapterWith(SetTodoAsNotDoneController, request, response)
  })

  // UpdateTodo
  fastify.put("/api/todos/:todoId", async (request, response) => {
    callAdapterWith(UpdateTodoController, request, response)
  })
}

export default todosRoutesPluginCallback
