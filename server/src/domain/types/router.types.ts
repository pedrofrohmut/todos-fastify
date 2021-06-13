export type AdaptedRequest = {
  body: object | null
  authUserId: string | null
  params: object | null
}

export type Controller = {
  execute(request: AdaptedRequest): Promise<ControllerResponse>
}

export type ControllerResponse = {
  status: number
  body?: any
}

