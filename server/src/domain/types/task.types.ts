export type TaskDto = {
  id: string
  name: string
  description?: string
  userId: string
}

export type CreateTaskDto = Omit<TaskDto, "id">

export type TaskTableDto = {
  id: string
  name: string
  description: string
  user_id: string
}
