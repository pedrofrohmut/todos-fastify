import { AuthenticationHeaders } from "../../../domain/types/controller/header.types"
import { TaskIdParam, TodoIdParam, UserIdParam } from "../../../domain/types/controller/param.types"

export type AdaptedRequestBody = null | object

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
  body?: any
}
