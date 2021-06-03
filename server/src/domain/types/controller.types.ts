export type AuthenticationHeaders = {
  authenticationToken: string
}

export type CreateTaskBody = {
  name: string
  description?: string
}

export type CreateTaskRequest = {
  body: CreateTaskBody
  headers: AuthenticationHeaders
  params: UserIdParam
}

export type CreateTaskResponse = {
  status: 201 | 400 | 500
  body?: string
}

export type UserIdParam = {
  userId: string
}
