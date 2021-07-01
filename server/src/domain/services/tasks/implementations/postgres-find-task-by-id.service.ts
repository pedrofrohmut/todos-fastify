import DatabaseConnection from "../../../database/database-connection.interface"
import { TaskDto, TaskTableDto } from "../../../types/task.types"

import FindTaskByIdService from "../find-task-by-id-service.interface"

export default class PostgresFindTaskByIdService implements FindTaskByIdService {
  constructor(private readonly connection: DatabaseConnection) {}

  private getQueryResultRows(taskId: string) {
    return this.connection.query<TaskTableDto>(
      "SELECT name, description, user_id FROM app.tasks WHERE id = $1",
      [taskId]
    )
  }

  private mapFirstRowToTask(taskId: string, rows: TaskTableDto[]) {
    const { name, description, user_id } = rows[0]
    return {
      id: taskId,
      name,
      description,
      userId: user_id
    }
  }

  public async execute(taskId: string): Promise<TaskDto | null> {
    const rows = await this.getQueryResultRows(taskId)
    if (rows.length === 0) {
      return null
    }
    const task = this.mapFirstRowToTask(taskId, rows)
    return task
  }
}
