import { AuthenticationHeaders } from "../../../domain/types/controller/header.types"
import { TaskIdParam, TodoIdParam, UserIdParam } from "../../../domain/types/controller/param.types"

// eslint-disable-next-line
export type AdaptedRequestBody = null | any

export type AdaptedRequest = {
  body: AdaptedRequestBody
  headers: AdaptedRequestHeaders
  params: AdaptedRequestParams
}

export type AdaptedRequestHeaders = AuthenticationHeaders | null

export type AdaptedRequestParams = TaskIdParam | TodoIdParam | UserIdParam | null

export type Controller = {
  execute(request: AdaptedRequest): Promise<ControllerResponse>
}

export type ControllerResponse = {
  status: number
  // eslint-disable-next-line
  body?: any
}
