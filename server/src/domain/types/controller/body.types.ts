export type CreateTaskBody = {
  name: string
  description?: string
}

export type CreateTodoBody = {
  name: string
  description?: string
}

export type CreateUserBody = {
  name: string
  email: string
  password: string
}

export type SignedUserBody = {
  id: string
  name: string
  email: string
  token: string
}

export type SignInUserBody = {
  email: string
  password: string
}

export type TaskBody = {
  id: string
  name: string
  description?: string
  userId: string
}

export type TodoBody = {
  id: string
  name: string
  description?: string
  taskId: string
  userId: string
}
