import { AdaptedRequestParams } from "./controller-adapter.types"

export default class RequestParamsAdapter {
  public static execute(params?: any): AdaptedRequestParams {
    if (
      params === undefined ||
      params === null ||
      typeof params !== "object" ||
      Object.keys(params).length === 0
    ) {
      return null
    }
    return params
  }
}
