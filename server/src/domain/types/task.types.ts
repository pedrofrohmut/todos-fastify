export type TaskDto = {
  id: string
  name: string
  description?: string
  userId: string
}

export type CreateTaskDto = {
  name: string
  description: string
  userId: string
}
