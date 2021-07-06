import DatabaseConnection from "../../../database/database-connection.interface"
import { TodoDto, TodoTableDto } from "../../../types/todo.types"

import FindTodoByIdService from "../find-todo-by-id-service.test"

export default class PostgresFindTodoByIdService implements FindTodoByIdService {
  constructor(private readonly connection: DatabaseConnection) {}

  private getQueryResultRows(todoId: string) {
    return this.connection.query<TodoTableDto>(
      "SELECT name, description, is_done, task_id, user_id FROM app.todos WHERE id = $1",
      [todoId]
    )
  }

  private mapFirstRowToTodo(todoId: string, rows: TodoTableDto[]) {
    const { name, description, is_done, task_id, user_id } = rows[0]
    return {
      id: todoId,
      name,
      description,
      isDone: is_done,
      taskId: task_id,
      userId: user_id
    }
  }

  public async execute(todoId: string): Promise<TodoDto | null> {
    const rows = await this.getQueryResultRows(todoId)
    if (rows.length === 0) {
      return null
    }
    const todo = this.mapFirstRowToTodo(todoId, rows)
    return todo
  }
}
