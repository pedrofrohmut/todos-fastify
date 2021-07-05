export type TodoDto = {
  id: string
  name: string
  description?: string
  isDone: boolean
  taskId: string
  userId: string
}

export type CreateTodoDto = Omit<TodoDto, "id" | "isDone">

export type TodoTableDto = {
  id: string
  name: string
  description: string
  is_done: boolean
  task_id: string
  user_id: string
}
