import { v4 as uuid } from "uuid"

export default class FakeTodoService {
  public static getTodoFromService(todoDB: {
    id: string
    name: string
    description: string
    is_done: boolean
    task_id: string
    user_id: string
  }) {
    return {
      id: todoDB.id,
      name: todoDB.name,
      description: todoDB.description,
      isDone: todoDB.is_done,
      taskId: todoDB.task_id,
      userId: todoDB.user_id
    }
  }

  public static getTodoDB(code: string, userId: string, taskId: string, todoId: string) {
    return {
      id: todoId || uuid(),
      name: "Todo Name " + code,
      description: "Todo Description " + code,
      is_done: false,
      task_id: taskId || uuid(),
      user_id: userId || uuid()
    }
  }

  public static getValidTodoId() {
    return uuid()
  }
}
