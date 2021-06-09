import { FastifyPluginCallback } from "fastify"

import ClearCompleteTodoByTaskIdControllerImplementation from "../../domain/controllers/todos/implementations/clear-complete-todos-by-task-id.controller"
import CreateTodoControllerImplementation from "../../domain/controllers/todos/implementations/create-todo.controller"
import DeleteTodoControllerImplementation from "../../domain/controllers/todos/implementations/delete-todo.controller"
import FindTodoByIdControllerImplementation from "../../domain/controllers/todos/implementations/find-todo-by-id.controller"
import FindTodosByTaskIdControllerImplementation from "../../domain/controllers/todos/implementations/find-todos-by-task-id.controller"
import SetTodoAsDoneControllerImplementation from "../../domain/controllers/todos/implementations/set-todo-as-done.controller"
import SetTodoAsNotDoneControllerImplementation from "../../domain/controllers/todos/implementations/set-todo-as-not-done.controller"
import UpdateTodoControllerImplementation from "../../domain/controllers/todos/implementations/update-todo.controller"

import ControllerUtil from "../../utils/controllers/controller.util"
import { checkBodyExists } from "../../utils/routes/body.util"
import { checkHeadersForAuthentication } from "../../utils/routes/headers.util"
import { checkParamsForTaskId, checkParamsForTodoId } from "../../utils/routes/params.util"

/**
 * TODOS
 */
const todosRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // ClearCompleteTodosByTaskId
  fastify.delete("/api/todos/task/:taskId", async (request, response) => {
    const message = "Cannot clear complete todos by task id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(ClearCompleteTodoByTaskIdControllerImplementation)
  })

  // CreateTodoRoute
  fastify.post("/api/todos", async (request, response) => {
    const message = "Cannot create todo"
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(CreateTodoControllerImplementation)
  })

  // // DeleteTodoRoute
  fastify.delete("/api/todos/:todoId", async (request, response) => {
    const message = "Cannot delete todo"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(DeleteTodoControllerImplementation)
  })

  // FindTodoById
  fastify.get("/api/todos/:todoId", async (request, response) => {
    const message = "Cannot find todo by id"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(FindTodoByIdControllerImplementation)
  })

  // FindTodosByTaskId
  fastify.get("/api/todos/task/:taskId", async (request, response) => {
    const message = "Cannot find todos by task id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(FindTodosByTaskIdControllerImplementation)
  })

  // SetTodosAsDoneRoute
  fastify.patch("/api/todos/setdone/:todoId", async (request, response) => {
    const message = "Cannot set todo as done"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(SetTodoAsDoneControllerImplementation)
  })

  // SetTodoAsNotDone
  fastify.patch("/api/todos/setnotdone/:todoId", async (request, response) => {
    const message = "Cannot set todo as not done"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(SetTodoAsNotDoneControllerImplementation)
  })

  // UpdateTodo
  fastify.put("/api/todos/:todoId", async (request, response) => {
    const message = "Cannot update todo"
    checkParamsForTodoId(request, response, message)
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(UpdateTodoControllerImplementation)
  })
}

export default todosRoutesPluginCallback
