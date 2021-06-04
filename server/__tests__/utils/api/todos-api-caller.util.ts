import { CreateTodoBody } from "../../../src/domain/types/controller/body.types"
import { AuthenticationHeaders } from "../../../src/domain/types/controller/header.types"
import { ApiCallerResponse } from "./api.types"
import AxiosAdapter from "./axios-api-caller.adapter"

export default class TodosApiCaller {
  public static async clearCompleteTodosByTaskId(
    taskId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/task/" + taskId
    const response = await AxiosAdapter.delete(url, headers)
    return response
  }

  public static async createTodo(
    body: CreateTodoBody,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos"
    const response = await AxiosAdapter.post(url, body, headers)
    return response
  }

  public static async deleteTodo(
    todoId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/" + todoId
    const response = await AxiosAdapter.delete(url, headers)
    return response
  }

  public static async findTodoById(
    todoId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/" + todoId
    const response = await AxiosAdapter.get(url, headers)
    return response
  }

  public static async findTodosByTaskId(
    taskId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/task/" + taskId
    const response = await AxiosAdapter.get(url, headers)
    return response
  }

  public static async setTodoAsDone(
    todoId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/setdone/" + todoId
    const response = await AxiosAdapter.patch(url, headers)
    return response
  }

  public static async setTodoAsNotDone(
    todoId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/setnotdone/" + todoId
    const response = await AxiosAdapter.patch(url, headers)
    return response
  }

  public static async updateTodo(
    todoId: string,
    body: CreateTodoBody,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/todos/" + todoId
    const response = await AxiosAdapter.put(url, body, headers)
    return response
  }
}
