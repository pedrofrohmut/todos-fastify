import { ApiCallerResponse } from "./api.types"
import AxiosAdapter from "./axios-api-caller.adapter"

import { CreateTaskBody } from "../../../src/domain/types/controller/body.types"
import { AuthenticationHeaders } from "../../../src/domain/types/controller/header.types"

export default class TaskApiCaller {
  public static async createTask(
    body: CreateTaskBody,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/tasks"
    const response = await AxiosAdapter.post(url, body, headers)
    return response
  }

  public static async deleteTask(
    taskId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/tasks/" + taskId
    const response = await AxiosAdapter.delete(url, headers)
    return response
  }

  public static async findTaskById(
    taskId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/tasks/" + taskId
    const response = await AxiosAdapter.get(url, headers)
    return response
  }

  public static async findTasksByUserId(
    userId: string,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/tasks/user/" + userId
    const response = await AxiosAdapter.get(url, headers)
    return response
  }

  public static async updateTask(
    taskId: string,
    body: CreateTaskBody,
    headers: AuthenticationHeaders
  ): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/tasks/" + taskId
    const response = await AxiosAdapter.put(url, body, headers)
    return response
  }
}
