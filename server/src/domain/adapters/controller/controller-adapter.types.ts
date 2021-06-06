export type AdaptedRequestBody = object | null

export type AdaptedRequest = {
  body?: AdaptedRequestBody
  headers?: AdaptedRequestHeaders
  params?: AdaptedRequestParams
}

export type AdaptedRequestHeaders = { authenticationToken: string } | null

export type AdaptedRequestParams =
  | { userId: string }
  | { taskId: string }
  | { todoId: string }
  | null

export type Controller = {
  execute(request: AdaptedRequest): Promise<ControllerResponse>
}

export type ControllerResponse = {
  status: number
  body?: any
}
