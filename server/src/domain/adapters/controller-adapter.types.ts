export type AdapterRequestBody = object | null

export type AdapterRequestHeaders = { authenticationToken: string } | null

export type AdapterRequestParams =
  | { userId: string }
  | { taskId: string }
  | { todoId: string }
  | null

export type AdapterRequest = {
  body?: AdapterRequestBody
  headers?: AdapterRequestHeaders
  params?: AdapterRequestParams
}

export type AdapterResponse = {
  status: number
  body?: any
}
