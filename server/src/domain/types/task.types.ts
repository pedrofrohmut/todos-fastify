export type TaskDto = {
  id: string
  name: string
  description?: string
  userId: string
}

export type CreateTaskDto = Omit<TaskDto, "id">

export type UpdateTaskDto = Omit<TaskDto, "userId">

export type TaskTableDto = {
  id: string
  name: string
  description: string
  user_id: string
}
