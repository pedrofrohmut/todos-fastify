import { AdaptedRequestParams } from "./controller-adapter.types"

export default class RequestParamsAdapter {
  public static execute(params?: any): AdaptedRequestParams {
    if (
      params === undefined ||
      params === null ||
      typeof params !== "object" ||
      Object.keys(params).length === 0 ||
      (params.taskId === undefined && params.todoId === undefined && params.userId === undefined) ||
      Object.keys(params).length > 1
    ) {
      return null
    }
    return params
  }
}
