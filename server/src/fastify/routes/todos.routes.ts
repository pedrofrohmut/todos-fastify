import { FastifyPluginCallback } from "fastify"

import ClearCompleteTodoByTaskIdControllerImplementation from "../../domain/controllers/todos/implementations/clear-complete-todos-by-task-id.controller"
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
  fastify.delete("/api/todos/task/:taskId", async (request, _response) => {
    request.router.routeController(ClearCompleteTodoByTaskIdControllerImplementation)
  })

  // CreateTodoRoute
  fastify.post("/api/todos", async (request, _response) => {
    request.router.routeController(CreateTodoControllerImplementation)
  })

  // // DeleteTodoRoute
  fastify.delete("/api/todos/:todoId", async (request, _response) => {
    request.router.routeController(DeleteTodoControllerImplementation)
  })

  // FindTodoById
  fastify.get("/api/todos/:todoId", async (request, _response) => {
    request.router.routeController(FindTodoByIdControllerImplementation)
  })

  // FindTodosByTaskId
  fastify.get("/api/todos/task/:taskId", async (request, _response) => {
    request.router.routeController(FindTodosByTaskIdControllerImplementation)
  })

  // SetTodosAsDoneRoute
  fastify.patch("/api/todos/setdone/:todoId", async (request, _response) => {
    request.router.routeController(SetTodoAsDoneControllerImplementation)
  })

  // SetTodoAsNotDone
  fastify.patch("/api/todos/setnotdone/:todoId", async (request, _response) => {
    request.router.routeController(SetTodoAsNotDoneControllerImplementation)
  })

  // UpdateTodo
  fastify.put("/api/todos/:todoId", async (request, _response) => {
    request.router.routeController(UpdateTodoControllerImplementation)
  })
}

export default todosRoutesPluginCallback
