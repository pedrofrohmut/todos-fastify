import { SignedUserBody, TaskBody, TodoBody } from "./body.types"

export type ClearCompleteTodosByTaskIdResponse = {
  status: 204 | 400 | 500
  body?: string
}

export type CreateTaskResponse = {
  status: 201 | 400 | 401 | 500
  body?: string
}

export type CreateTodoResponse = {
  status: 201 | 400 | 500
  body?: string
}

export type CreateUserResponse = {
  status: 201 | 400 | 500
  body?: string
}

export type DeleteTaskResponse = {
  status: 204 | 400 | 500
  body?: string
}

export type DeleteTodoResponse = {
  status: 204 | 400 | 500
  body?: string
}

export type FindTaskByIdResponse = {
  status: 200 | 400 | 500
  body: TaskBody | string
}

export type FindTodoByIdResponse = {
  status: 200 | 400 | 500
  body?: TodoBody | string
}

export type FindTodosByTaskIdResponse = {
  status: 200 | 400 | 500
  body?: TodoBody[] | string
}

export type FindTasksByUserIdResponse = {
  status: 200 | 400 | 500
  body: TaskBody[] | string
}

export type GetSignedUserResponse = {
  status: 200 | 400 | 500
  body: SignedUserBody | string
}

export type RequestValidationResponse = {
  status: 400 | 401
  body: string
}

export type SetTodoAsDoneResponse = {
  status: 204 | 400 | 500
  body?: string
}

export type SetTodoAsNotDoneResponse = {
  status: 204 | 400 | 500
  body?: string
}

export type SignInUserResponse = {
  status: 200 | 400 | 500
  body: SignedUserBody | string
}

export type UpdateTaskResponse = {
  status: 204 | 400 | 500
  body?: string
}

export type UpdateTodoResponse = {
  status: 204 | 400 | 500
  body?: string
}
