import { AuthenticationToken } from "./auth/token.types"

export type Params = null | {
  taskId?: string
  todoId?: string
  userId?: string
}

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
