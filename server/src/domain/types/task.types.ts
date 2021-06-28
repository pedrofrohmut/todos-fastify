export type TaskDto = {
  id: string
  name: string
  description?: string
  userId: string
}

export type TaskTableDto = {
  id: string
  name: string
  description: string
  user_id: string
}

export type CreateTaskDto = {
  name: string
  description: string
  userId: string
}
