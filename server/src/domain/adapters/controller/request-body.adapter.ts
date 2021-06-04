import { AdaptedRequestBody } from "./controller-adapter.types"

export default class RequestBodyAdapter {
  public static execute(body?: any): AdaptedRequestBody {
    if (body === undefined || body === null || typeof body !== "object") {
      return null
    }
    if (Object.keys(body).length === 0) {
      return null
    }
    return body
  }
}
