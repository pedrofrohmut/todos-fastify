import { IncomingHttpHeaders } from "http"
import { AdaptedRequestHeaders } from "./controller-adapter.types"

export default class RequestHeadersAdapter {
  public static execute(headers: IncomingHttpHeaders): AdaptedRequestHeaders {
    if (
      headers === undefined ||
      headers === null ||
      (headers.authentication_token === undefined && headers.authorization === undefined)
    ) {
      return null
    }
    const token = headers.authentication_token || headers.authorization
    if (typeof token !== "string") {
      return null
    }
    return {
      authenticationToken: token
    }
  }
}
