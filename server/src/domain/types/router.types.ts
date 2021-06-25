import {AuthenticationToken} from "./auth/token.types"
import { TaskIdParam, TodoIdParam, UserIdParam } from "./request/param.types"

export type Params = TaskIdParam | TodoIdParam | UserIdParam

export type AdaptedRequest<T> = {
  body: T
  authToken: AuthenticationToken | null
  params: Params | null
}

export type Controller<T, U> = {
  execute(request: AdaptedRequest<T>): Promise<ControllerResponse<U>>
}

export type ControllerResponse<T> = {
  status: number
  body?: T | string
}
