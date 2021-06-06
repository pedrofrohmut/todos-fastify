import { IncomingHttpHeaders } from "http"
import { AdaptedRequestHeaders } from "./controller-adapter.types"

export default class RequestHeadersAdapter {
  public static execute(
    headers: IncomingHttpHeaders | { authentication_token: string }
  ): AdaptedRequestHeaders {
    if (
      headers === undefined ||
      headers == null ||
      headers.authentication_token === undefined ||
      headers.authentication_token === null
    ) {
      return null
    }
    if (typeof headers.authentication_token !== "string") {
      throw new Error(
        "[RequestHeadersAdapter] The header authentication_token is not a valid string"
      )
    }
    return {
      authenticationToken: headers.authentication_token
    }
  }
}
