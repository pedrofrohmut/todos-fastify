import { CreateTaskBody, CreateTodoBody, CreateUserBody, SignInUserBody } from "./body.types"
import { AuthenticationHeaders } from "./header.types"
import { TaskIdParam, TodoIdParam, UserIdParam } from "./param.types"

export type ClearCompleteTodosByTaskIdRequest = {
  headers: AuthenticationHeaders
  params: TaskIdParam
}

export type CreateTaskRequest = {
  body: CreateTaskBody
  headers: AuthenticationHeaders
}

export type CreateTodoRequest = {
  body: CreateTodoBody
  headers: AuthenticationHeaders
}

export type CreateUserRequest = {
  body: CreateUserBody
}

export type DeleteTaskRequest = {
  headers: AuthenticationHeaders
  params: TaskIdParam
}

export type DeleteTodoRequest = {
  headers: AuthenticationHeaders
  params: TodoIdParam
}

export type FindTaskByIdRequest = {
  headers: AuthenticationHeaders
  params: TaskIdParam
}

export type FindTodoByIdRequest = {
  headers: AuthenticationHeaders
  params: TodoIdParam
}

export type FindTodosByTaskIdRequest = {
  headers: AuthenticationHeaders
  params: TaskIdParam
}

export type FindTasksByUserIdRequest = {
  headers: AuthenticationHeaders
  params: UserIdParam
}

export type GetSignedUserRequest = {
  headers: AuthenticationHeaders
}

export type SetTodoAsDoneRequest = {
  headers: AuthenticationHeaders
  params: TodoIdParam
}

export type SetTodoAsNotDoneRequest = {
  headers: AuthenticationHeaders
  params: TodoIdParam
}

export type SignInUserRequest = {
  body: SignInUserBody
}

export type UpdateTaskRequest = {
  body: CreateTaskBody
  header: AuthenticationHeaders
  params: TaskIdParam
}

export type UpdateTodoRequest = {
  body: CreateTodoBody
  headers: AuthenticationHeaders
  params: TodoIdParam
}
