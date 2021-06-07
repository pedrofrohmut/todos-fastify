import { FastifyPluginCallback } from "fastify"
import { TodoBody } from "../../domain/types/controller/body.types"

import { checkBodyExists } from "../../domain/utils/routes/body.util"
import { checkHeadersForAuthentication } from "../../domain/utils/routes/headers.util"
import { checkParamsForTaskId, checkParamsForTodoId } from "../../domain/utils/routes/params.util"

/**
 * TODOS
 */
const todosRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // ClearCompleteTodosByTaskId
  fastify.delete("/api/todos/task/:taskId", async (request, response) => {
    const message = "Cannot clear complete todos by task id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })

  // CreateTodoRoute
  fastify.post("/api/todos", async (request, response) => {
    const message = "Cannot create todo"
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(201).send()
  })

  // // DeleteTodoRoute
  fastify.delete("/api/todos/:todoId", async (request, response) => {
    const message = "Cannot delete todo"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })

  // FindTodoById
  fastify.get("/api/todos/:todoId", async (request, response) => {
    const message = "Cannot find todo by id"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    const responseBody: TodoBody = {
      id: "id",
      name: "todo_name",
      description: "todo_description",
      taskId: "task_id",
      userId: "user_id"
    }
    response.status(200).send(responseBody)
  })

  // FindTodosByTaskId
  fastify.get("/api/todos/task/:taskId", async (request, response) => {
    const message = "Cannot find todos by task id"
    checkParamsForTaskId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    const responseBody: TodoBody[] = [
      {
        id: "id",
        name: "todo_name",
        description: "todo_description",
        taskId: "task_id",
        userId: "user_id"
      },
      {
        id: "id",
        name: "todo_name",
        description: "todo_description",
        taskId: "task_id",
        userId: "user_id"
      },
      {
        id: "id",
        name: "todo_name",
        description: "todo_description",
        taskId: "task_id",
        userId: "user_id"
      }
    ]
    response.status(200).send(responseBody)
  })

  // SetTodosAsDoneRoute
  fastify.patch("/api/todos/setdone/:todoId", async (request, response) => {
    const message = "Cannot set todo as done"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })

  // SetTodoAsNotDone
  fastify.patch("/api/todos/setnotdone/:todoId", async (request, response) => {
    const message = "Cannot set todo as not done"
    checkParamsForTodoId(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })

  // UpdateTodo
  fastify.put("/api/todos/:todoId", async (request, response) => {
    const message = "Cannot update todo"
    checkParamsForTodoId(request, response, message)
    checkBodyExists(request, response, message)
    checkHeadersForAuthentication(request, response, message)
    response.status(204).send()
  })
}

export default todosRoutesPluginCallback
