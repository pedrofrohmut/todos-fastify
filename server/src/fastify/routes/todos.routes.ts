import { FastifyPluginCallback } from "fastify"

import callAdapterWith from "../../domain/adapters/controller/call-adapter-with.function"

import ClearCompleteTodosByTaskIdControllerImplementation from "../../domain/controllers/todos/implementations/clear-complete-todos-by-task-id.controller"
import CreateTodoControllerImplementation from "../../domain/controllers/todos/implementations/create-todo.controller"
import DeleteTodoControllerImplementation from "../../domain/controllers/todos/implementations/delete-todo.controller"
import FindTodoByIdControllerImplementation from "../../domain/controllers/todos/implementations/find-todo-by-id.controller"
import FindTodosByTaskIdControllerImplementation from "../../domain/controllers/todos/implementations/find-todos-by-task-id.controller"
import SetTodoAsDoneControllerImplementation from "../../domain/controllers/todos/implementations/set-todo-as-done.controller"
import SetTodoAsNotDoneControllerImplementation from "../../domain/controllers/todos/implementations/set-todo-as-not-done.controller"
import UpdateTodoControllerImplementation from "../../domain/controllers/todos/implementations/update-todo.controller"

/**
 * TODOS
 */
const todosRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // ClearCompleteTodosByTaskId
  fastify.delete("/api/todos/task/:taskId", async (request, response) => {
    callAdapterWith(ClearCompleteTodosByTaskIdControllerImplementation, request, response)
  })

  // CreateTodo
  fastify.post("/api/todos", async (request, response) => {
    callAdapterWith(CreateTodoControllerImplementation, request, response)
  })

  // DeleteTodo
  fastify.delete("/api/todos/:todoId", async (request, response) => {
    callAdapterWith(DeleteTodoControllerImplementation, request, response)
  })

  // FindTodoById
  fastify.get("/api/todos/:todoId", async (request, response) => {
    callAdapterWith(FindTodoByIdControllerImplementation, request, response)
  })

  // FindTodosByTaskId
  fastify.get("/api/todos/task/:taskId", async (request, response) => {
    callAdapterWith(FindTodosByTaskIdControllerImplementation, request, response)
  })

  // SetTodosAsDone
  fastify.patch("/api/todos/setdone/:todoId", async (request, response) => {
    callAdapterWith(SetTodoAsDoneControllerImplementation, request, response)
  })

  // SetTodoAsNotDone
  fastify.patch("/api/todos/setnotdone/:todoId", async (request, response) => {
    callAdapterWith(SetTodoAsNotDoneControllerImplementation, request, response)
  })

  // UpdateTodo
  fastify.put("/api/todos/:todoId", async (request, response) => {
    callAdapterWith(UpdateTodoControllerImplementation, request, response)
  })
}

export default todosRoutesPluginCallback
