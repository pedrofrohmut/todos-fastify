export type CreateTaskBody = {
  name: string
  description?: string
}

export type CreateTodoBody = {
  name: string
  description?: string
  taskId: string
}

export type CreateUserBody = {
  name: string
  email: string
  password: string
}

export type SignInUserBody = {
  email: string
  password: string
}

export type UpdateTaskBody = {
  name: string
  description?: string
}

export type UpdateTodoBody = {
  name: string
  description?: string
  isDone: boolean
}
