export type Task = {
  id: string
  name: string
  description?: string
  userId: string
}

export type CreateTask = {
  name: string
  description: string
  userId: string
}
