import { TodoDto, TodoTableDto } from "../../../types/todo.types"

import DatabaseConnection from "../../../database/database-connection.interface"

import FindTodosByTaskIdService from "../find-todos-by-task-id-service.interface"

export default class PostgresFindTodosByTaskIdService implements FindTodosByTaskIdService {
  constructor(private readonly connection: DatabaseConnection) {}

  private getQueryResultRows(taskId: string) {
    return this.connection.query<TodoTableDto>(
      "SELECT id, name, description, is_done, user_id FROM app.todos WHERE task_id = $1",
      [taskId]
    )
  }

  private mapRowsToTodos(taskId: string, tasks: TodoTableDto[]) {
    return tasks.map(({ id, name, description, is_done, user_id }) => ({
      id,
      name,
      description,
      isDone: is_done,
      userId: user_id,
      taskId
    }))
  }

  public async execute(taskId: string): Promise<TodoDto[]> {
    const rows = await this.getQueryResultRows(taskId)
    if (rows.length === 0) {
      return []
    }
    const todos = this.mapRowsToTodos(taskId, rows)
    return todos
  }
}
